import { useProjectContext } from '../context/ProjectContext';
import { useStorage } from '../context/StorageContext';

/**
 * Global project and sprint selector. Shown below header so Board, Sprints, Metrics use the same selection.
 */
export default function ProjectSprintBar() {
  const { projectId, sprintId, setProjectId, setSprintId } = useProjectContext();
  const { projects, getSprints } = useStorage();
  const sprints = getSprints(projectId).sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

  if (projects.length === 0) return null;

  return (
    <div className="context-bar">
      <div className="context-bar-inner">
        <label className="context-bar-label">
          <span>Проект</span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="context-bar-select"
            title="Текущий проект"
          >
            <option value="">— Выберите проект —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="context-bar-label">
          <span>Спринт</span>
          <select
            value={sprintId}
            onChange={(e) => setSprintId(e.target.value)}
            className="context-bar-select"
            title="Текущий спринт"
            disabled={!projectId}
          >
            <option value="">Все / бэклог</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
