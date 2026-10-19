export const dateKey = (date = new Date()) => { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export const fromKey = key => { const [y,m,d]=key.split('-').map(Number); return new Date(y,m-1,d,12); };
export const shiftDate = (date, amount) => { const d=new Date(date); d.setDate(d.getDate()+amount); return d; };
export const startOfWeek = (date, weekStart=1) => { const d=new Date(date); d.setHours(12,0,0,0); d.setDate(d.getDate()-((d.getDay()-weekStart+7)%7)); return d; };
export const formatDate = (date, options={weekday:'long',month:'long',day:'numeric'}) => new Intl.DateTimeFormat(undefined,options).format(date);
export const sameDay = (a,b) => dateKey(a)===dateKey(b);
