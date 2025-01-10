import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";

interface ServiceCardParams {
  type: string
  title: string
  description: string
  to : string
  icon : string
  image : string
}
const ServiceCard: React.FC<ServiceCardParams> = ({ type = 'left', title, description, to, icon, image }) => {
  if (type === "left") {
    return (
      <div>
        <div className="flex w-10/12 gap-x-8 mx-auto py-8 items-center">
          <div className="flex-1">
            <img className="w-10" src={icon} />
            <h2 className="mt-4 text-3xl font-medium text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-700">{description}</p>
            <Link to={to} className="mt-8 inline-flex bg-primary text-white px-6 py-2 rounded-full items-center gap-2"><span>See Details</span><IoIosArrowRoundForward className="text-2xl" /></Link>
          </div>
          <div className="flex-1">
            <img className="rounded-md" src={image} />
          </div>
        </div>

      </div>
    )
  } else if(type === "right") {
    return (
      <div>
        <div className="flex w-10/12 gap-x-8 mx-auto py-8 items-center">
          <div className="flex-1 order-2">
          <img className="w-10" src={icon} />
            <h2 className="mt-4 text-3xl font-medium text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-700">{description}</p>
            <Link to={to} className="mt-8 inline-flex bg-primary text-white px-6 py-2 rounded-full items-center gap-2"><span>See Details</span><IoIosArrowRoundForward className="text-2xl" /></Link>
          </div>
          <div className="flex-1 order-1">
            <img className="rounded-md" src={image} />
          </div>
        </div>

      </div>
    )
  }

}

export default ServiceCard