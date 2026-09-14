import kvOriginal from "../../../assets/brand/kv-original.png";

type Props = {
  eventName: string;
};

export function AppHeader({ eventName }: Props) {
  return (
    <header className="app-header">
      <img className="header-brand-strip" src={kvOriginal} alt={`Kaspi.kz и ${eventName}`} />
    </header>
  );
}
