import kaspiLogo from "../../../assets/brand/logos/kaspikz-logo-1.png";

type Props = {
  eventName: string;
};

export function AppHeader({ eventName }: Props) {
  return (
    <header className="app-header">
      <img className="header-logo" src={kaspiLogo} alt="Kaspi.kz" />
      <div className="event-lockup">
        <strong>{eventName}</strong>
      </div>
    </header>
  );
}
