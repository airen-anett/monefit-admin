export function badgeClass(s: string) {
  const map: Record<string,string> = {
    'Active':'active','Blocked':'blocked','Frozen':'frozen',
    'Approved':'approved','Rejected':'rejected','Canceled':'canceled','Expired':'expired','Inactive':'inactive',
    'In review':'review','Incoming':'incoming','Received':'received','Under review':'underreview','Won':'won','Lost':'lost',
    'Accepted':'accepted','Cleared':'cleared','Settled':'settled','Declined':'declined',
    'Sent':'sent','Delivered':'delivered','Opened':'opened','Failed':'failed',
    'Enabled':'enabled','Disabled':'disabled',
    'Staging':'staging','Production':'production','Development':'development',
    'SMS':'sms','Push':'push','Email':'email',
    'Admin':'admin','Support':'support',
  };
  return `badge badge-${map[s]||'inactive'}`;
}

export function Badge({ status }: { status: string }) {
  return <span className={badgeClass(status)}>{status}</span>;
}
