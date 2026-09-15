import kvOriginal from "../../../assets/brand/kv-original.png";
import kaspiLogoWhite from "../../../assets/brand/logos/kaspikz-logo-white.svg";

type Props = {
  eventName: string;
  integrated?: boolean;
};

export function AppHeader({ eventName, integrated = false }: Props) {
  if (integrated) {
    return (
      <header className="app-header app-header-integrated" aria-label={`Kaspi.kz и ${eventName}`}>
        <img className="header-kaspi-logo" src={kaspiLogoWhite} alt="Kaspi.kz" />
        <span className="header-marathon-logo" role="img" aria-label={eventName}>
          <img src={kvOriginal} alt="" aria-hidden />
        </span>
      </header>
    );
  }

  return (
    <header className="app-header">
      <img className="header-brand-strip" src={kvOriginal} alt={`Kaspi.kz и ${eventName}`} />
    </header>
  );
}
