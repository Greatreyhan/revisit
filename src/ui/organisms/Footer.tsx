import { Link } from "react-router-dom";
import { Logo } from "../../assets/icons";
import { BsInstagram, BsWhatsapp } from "react-icons/bs";
import { BiLogoGmail, BiLogoLinkedin } from "react-icons/bi";

const Footer = () => {
  return (
    <div className="w-full mx-auto bg-base-dark">
      <div className="flex flex-wrap md:w-10/12 w-full px-3 md:px-0 mx-auto justify-around items-start pt-4">
        <div className="md:w-4/12 w-full text-white text-normal p-3">
          <img className="w-24 mt-9" src={Logo} />
          <h4 className="font-bold mt-4 text-xl">Isuzu Astra Motor Indonesia</h4>
          <address className="mt-3">
            <p className="font-semibold ">Bekasi</p>
            Jl. Pejuang, RT.007/RW.016, Harapan Jaya, Kecamatan Medan Satria, Kota Bks, Jawa Barat 17124
          </address>


        </div>
        <div className="flex flex-col flex-1 mx-8">
          <div className="flex justify-end gap-3 mt-6">
            <a
              className="mt-3 text-primary w-10 h-10 p-2.5 bg-base-white rounded-full inline-block hover:text-white"
              target="_blank"
              href="https://www.instagram.com/isuzuid/"
            >
              <BsInstagram className="w-full h-full" />
            </a>
            <a
              className="mt-3 text-primary w-10 h-10 p-2.5 bg-base-white rounded-full inline-block hover:text-white"
              target="_blank"
              href="mailto:contact@isuzu-astra.com"
            >
              <BiLogoGmail className="w-full h-full" />
            </a>
            <a
              className="mt-3 text-primary w-10 h-10 p-2.5 bg-base-white rounded-full inline-block hover:text-white"
              target="_blank"
              href="https://wa.me/6289503953090"
            >
              <BsWhatsapp className="w-full h-full" />
            </a>
            <a
              className="mt-3 text-primary w-10 h-10 p-2.5 bg-base-white rounded-full inline-block hover:text-white"
              target="_blank"
              href="https://www.linkedin.com/company/isuzu-astra-motor-indonesia"
            >
              <BiLogoLinkedin className="w-full h-full" />
            </a>
          </div>
          <div className="flex justify-around flex-1">
            <div className="md:flex-1 w-4/12 text-white flex flex-col p-2 mt-8 md:pl-10 pl-0">
              <h5 className="mt-1 font-bold text-xl">
                Navigation
              </h5>
              <Link className="mt-3 text-gray-300 hover:text-white" to="/">
                Home
              </Link>
              <Link
                className="mt-3 text-gray-300 hover:text-white"
                to="/service"
              >
                Dashboard
              </Link>
              <Link
                className="mt-3 text-gray-300 hover:text-white"
                to="/portofolio"
              >
                Literature
              </Link>
              <Link className="mt-3 text-gray-300 hover:text-white" to="/about">
                Assistant
              </Link>
              <Link
                className="mt-3 text-gray-300 hover:text-white"
                to="/blog"
              >
                Report
              </Link>
            </div>
            <div className="md:flex-1 w-4/12 text-white flex flex-col p-2 mt-8">
              <h5 className="mt-1 font-bold text-xl">
                Document
              </h5>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://wa.me/6282210100098/?text=Halo%2C%20saya%20ingin%20bertanya%20terkait%20layanan%20di%20bidang%20Litigasi%20dari%20Abdurrahman%20%26%20Co."
              >
                BBG
              </a>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://wa.me/6282210100098/?text=Halo%2C%20saya%20ingin%20bertanya%20terkait%20layanan%20di%20bidang%20Non%20Litigasi%20dari%20Abdurrahman%20%26%20Co."
              >
                Workshop Manual
              </a>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://wa.me/6282210100098/?text=Halo%2C%20saya%20ingin%20bertanya%20terkait%20layanan%20di%20bidang%20Retainer%20dari%20Abdurrahman%20%26%20Co."
              >
                Visit Report
              </a>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://wa.me/6282210100098/?text=Halo%2C%20saya%20ingin%20bertanya%20terkait%20layanan%20di%20bidang%20Retainer%20dari%20Abdurrahman%20%26%20Co."
              >
                Parts Library
              </a>
            </div>
            <div className="md:flex-1 w-4/12 text-white flex flex-col p-2 mt-8 md:pl-10 pl-0">
              <h5 className="mt-1 font-bold text-xl">
                Services
              </h5>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://www.instagram.com/abdurrahman.lawfirm/"
              >
                Report Creator
              </a>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="mailto:abdurrahman.and.co@gmail.com"
              >
                Problem Consultation
              </a>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://wa.me/6282210100098"
              >
                Schedule to Visit
              </a>
              <a
                className="mt-3 text-gray-300 hover:text-white"
                target="_blank"
                href="https://www.linkedin.com/company/abdurrahman-co/"
              >
                Product Knowledge
              </a>
            </div>
          </div>
        </div>

      </div>
      <p className="text-center mt-8 text-white text-sm">
        © Revisit
      </p>
    </div>
  );
};

export default Footer;
