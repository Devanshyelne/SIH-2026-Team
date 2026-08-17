import {
  HomeIcon,
  MapIcon,
  RouteIcon,
  TrainFrontIcon,
  UserIcon,
} from "lucide-react";
import { useSetu } from "../contexts/SetuContext";
import type { Tab } from "../types/setu";

const items: {
  id: Tab;
  label: string;
  Icon: typeof HomeIcon;
}[] = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "journey", label: "Journey", Icon: RouteIcon },
  { id: "map", label: "Map", Icon: MapIcon },
  { id: "coach", label: "Coach", Icon: TrainFrontIcon },
  { id: "profile", label: "Profile", Icon: UserIcon },
];

export function BottomNav() {
  const { tab, setTab, closeOverlay } = useSetu();

  return (
    <nav
      aria-label="Primary"
      className="
        shrink-0
        w-full
        bg-white
        border-t
        hairline
        px-1
        pt-1
      "
    >
      <ul className="flex w-full">
        {items.map(({ id, label, Icon }) => {
          const active = tab === id;

          return (
            <li
              key={id}
              className="flex-1 min-w-0"
            >
              <button
                onClick={() => {
                  closeOverlay();
                  setTab(id);
                }}
                aria-current={
                  active ? "page" : undefined
                }
                className={`
                  tap
                  w-full
                  min-w-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-0.5
                  rounded-lg
                  px-1
                  py-1
                  transition-colors
                  duration-150
                  ease-out
                  ${
                    active
                      ? "text-navy"
                      : "text-muted hover:text-navy"
                  }
                `}
              >
                <Icon
                  className="w-[21px] h-[21px] shrink-0"
                  strokeWidth={
                    active ? 2.2 : 1.7
                  }
                />

                <span
                  className={`
                    txt-xs
                    max-w-full
                    truncate
                    ${
                      active
                        ? "font-semibold"
                        : "font-medium"
                    }
                  `}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}