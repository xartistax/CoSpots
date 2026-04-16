import { getHosts } from "@/lib/firebase/host";
import { HostsShell } from "./hosts-shell";

export async function HostList() {
  const hosts = await getHosts();

  return <HostsShell hosts={hosts} />;
}
