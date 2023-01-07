import { useApp } from "@kitly/app"; 

export function Watcher() {
  const app = useApp();
  const pan = app.useWorkspaceStore((state) => state.pan);

  return (
    <>
      <div
        className="bg-violet-500 w-full h-px fixed"
        style={{
          left: -pan[0],
        }}
      />
    </>
  );
}
