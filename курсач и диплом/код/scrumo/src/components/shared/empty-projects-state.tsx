import Link from "next/link";

type Props = {
  title: string;
  description: string;
};

export function EmptyProjectsState({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-neutral-500">{description}</p>
      <Link
        href="/projects"
        className="mt-4 inline-flex text-sm font-medium text-black underline"
      >
        Перейти к проектам
      </Link>
    </div>
  );
}
