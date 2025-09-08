

type props = {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
    className?: string
}
const InfoCard = ({ icon, label, children, className = "" }: props) => (
  <div
    className={`bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900">{children}</div>
      </div>
    </div>
  </div>
);

export default InfoCard;