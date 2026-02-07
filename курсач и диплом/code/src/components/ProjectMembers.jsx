import { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

/**
 * Modal: list project members, invite (add) and remove. Only owner can manage.
 */
export default function ProjectMembers({ open, onClose, project }) {
  const { getProjectMembers, addProjectMember, removeProjectMember, isProjectOwner } = useStorage();
  const { users } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');

  const isOwner = project && isProjectOwner(project.id);

  useEffect(() => {
    if (!open || !project?.id) {
      setMembers([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProjectMembers(project.id).then((list) => {
      if (!cancelled) setMembers(Array.isArray(list) ? list : []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [open, project?.id, getProjectMembers]);

  const resolveName = (m) => {
    if (m.name) return m.name;
    return users?.find((u) => u.id === m.id)?.name || m.id;
  };

  const existingIds = new Set(members.map((m) => m.id));
  const availableToInvite = (users || []).filter((u) => !existingIds.has(u.id));

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteUserId || !project?.id) return;
    try {
      await addProjectMember(project.id, inviteUserId);
      const list = await getProjectMembers(project.id);
      setMembers(Array.isArray(list) ? list : []);
      setInviteUserId('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (userId) => {
    if (!project?.id || !window.confirm('Убрать участника из проекта?')) return;
    try {
      await removeProjectMember(project.id, userId);
      const list = await getProjectMembers(project.id);
      setMembers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Участники: ${project.name}`}>
      {loading ? (
        <p className="text-muted">Загрузка…</p>
      ) : (
        <>
          <ul className="project-members-list">
            {members.map((m) => (
              <li key={m.id} className="project-members-item">
                <span className="project-members-name">{resolveName(m)}</span>
                <span className="project-members-role">{m.role === 'owner' ? 'Владелец' : 'Участник'}</span>
                {isOwner && m.role !== 'owner' && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => handleRemove(m.id)}
                    title="Убрать"
                  >
                    Убрать
                  </button>
                )}
              </li>
            ))}
          </ul>
          {isOwner && (
            <form onSubmit={handleInvite} className="project-members-invite">
              <select
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                className="project-members-select"
              >
                <option value="">— Пригласить пользователя —</option>
                {availableToInvite.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.email ? `(${u.email})` : ''}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-small" disabled={!inviteUserId}>
                Пригласить
              </button>
            </form>
          )}
          {!isOwner && members.length > 0 && (
            <p className="project-members-hint">Управление участниками доступно владельцу проекта.</p>
          )}
        </>
      )}
    </Modal>
  );
}
