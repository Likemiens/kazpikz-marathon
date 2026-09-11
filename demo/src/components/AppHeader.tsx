import kaspiLogo from "../../../assets/brand/logos/kaspikz-logo-white.svg";

export function AppHeader() {
  return (
    <header className="app-header">
      <img className="header-logo" src={kaspiLogo} alt="Kaspi.kz" />
      <div className="event-lockup" aria-label="Almaty Marathon Expo, 25–26 September">
        <strong>Almaty Marathon</strong>
        <span>Expo · 25—26 / 09</span>
      </div>
    </header>
  );
}
