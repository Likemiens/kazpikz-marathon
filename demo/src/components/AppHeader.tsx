import kaspiLogo from "../../../assets/brand/logos/kaspikz-logo-1.svg";

type Props = {
  eventName: string;
  eventMeta: string;
};

export function AppHeader({ eventName, eventMeta }: Props) {
  return (
    <header className="app-header">
      <img className="header-logo" src={kaspiLogo} alt="Kaspi.kz" />
      <div className="event-lockup" aria-label={`${eventName}. ${eventMeta}`}>
        <strong>{eventName}</strong>
        <span>{eventMeta}</span>
      </div>
    </header>
  );
}
