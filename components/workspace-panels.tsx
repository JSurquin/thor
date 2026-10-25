"use client";

import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { useGroupRef, type Layout } from "react-resizable-panels";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import { useIsLargeScreen } from "@/lib/hooks/use-container-height";
import { useLocale } from "./locale-provider";
import { Button } from "./ui/button";

const PaneContext = createContext<{
  id: string;
  label: string;
  maximized: boolean;
  toggle: () => void;
} | null>(null);

export function WorkspacePaneControls() {
  const pane = useContext(PaneContext);
  const { messages } = useLocale();
  if (!pane) return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hidden size-8 shrink-0 lg:inline-flex"
      onClick={pane.toggle}
      aria-label={`${pane.maximized ? messages.ux.restore : messages.ux.maximize} : ${pane.label}`}
      aria-pressed={pane.maximized}
      title={pane.maximized ? messages.ux.restore : messages.ux.maximize}
    >
      {pane.maximized ? (
        <Minimize2Icon className="size-3.5" />
      ) : (
        <Maximize2Icon className="size-3.5" />
      )}
    </Button>
  );
}

export function WorkspacePanels({
  id,
  activePanel,
  panels,
}: {
  id: string;
  activePanel: string;
  panels: {
    id: string;
    label: string;
    content: ReactNode;
    size: number;
    min?: number;
  }[];
}) {
  const large = useIsLargeScreen();
  const { messages } = useLocale();
  const groupRef = useGroupRef();
  const savedLayout = useRef<Layout | null>(null);
  const [maximized, setMaximized] = useState<string | null>(null);
  const panelIds = panels.map((panel) => panel.id).join("|");
  useEffect(() => {
    if (!large) return;
    if (maximized) {
      groupRef.current?.setLayout(
        Object.fromEntries(
          panelIds
            .split("|")
            .map((panelId) => [panelId, panelId === maximized ? 100 : 0]),
        ),
      );
    } else if (savedLayout.current) {
      groupRef.current?.setLayout(savedLayout.current);
    }
  }, [maximized, large, groupRef, panelIds]);
  function toggle(panelId: string) {
    if (!maximized) savedLayout.current = groupRef.current?.getLayout() ?? null;
    setMaximized(maximized === panelId ? null : panelId);
  }
  const content = (panel: (typeof panels)[number]) => (
    <PaneContext.Provider
      value={
        large
          ? {
              id: panel.id,
              label: panel.label,
              maximized: maximized === panel.id,
              toggle: () => toggle(panel.id),
            }
          : null
      }
    >
      {panel.content}
    </PaneContext.Provider>
  );
  if (!large)
    return (
      <div className="workspace-panels-mobile flex min-h-0 flex-1 flex-col">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`min-h-0 flex-1 flex-col ${activePanel === panel.id ? "flex" : "hidden"}`}
            data-panel-name={panel.id}
          >
            {content(panel)}
          </div>
        ))}
      </div>
    );
  return (
    <div className="min-h-0 flex-1" title={messages.ux.layoutHint}>
      <ResizablePanelGroup
        id={id}
        groupRef={groupRef}
        disabled={Boolean(maximized)}
        orientation="horizontal"
        className="min-h-0"
      >
        {panels.map((panel, index) => (
          <Fragment key={panel.id}>
            {index > 0 && (
              <ResizableHandle
                withHandle
                disabled={Boolean(maximized)}
                className={maximized ? "hidden" : "workspace-resize-handle"}
                aria-label={messages.ux.resize}
              />
            )}
            <ResizablePanel
              id={panel.id}
              inert={Boolean(maximized && maximized !== panel.id)}
              aria-hidden={maximized && maximized !== panel.id ? true : undefined}
              defaultSize={`${panel.size}%`}
              minSize={maximized ? 0 : `${panel.min ?? 15}%`}
              className="flex min-h-0 min-w-0 flex-col"
              data-panel-name={panel.id}
            >
              {content(panel)}
            </ResizablePanel>
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
}
