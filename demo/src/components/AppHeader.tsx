import almatyMarathonLogoWhite from "../../../assets/brand/logos/almaty-marathon-logo-white.svg";
import kaspiLogoWhite from "../../../assets/brand/logos/kaspikz-logo-white.svg";

type Props = {
  eventName: string;
  integrated?: boolean;
};

export function AppHeader({ eventName, integrated = false }: Props) {
  const kaspiAsset = kaspiLogoWhite;
  const marathonAsset = almatyMarathonLogoWhite;

  return (
    <header
      className={`app-header${integrated ? " app-header-integrated" : ""}`}
      aria-label={`Kaspi.kz и ${eventName}`}
    >
      <img className="header-kaspi-logo" src={kaspiAsset} alt="Kaspi.kz" />
      <img className="header-marathon-logo" src={marathonAsset} alt={eventName} />
    </header>
  );
}
