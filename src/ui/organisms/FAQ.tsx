import DropDown from '../molecules/DropDown'

const FAQ = () => {
  return (
    <div className="my-32 mt-8 flex md:flex-row flex-col items-start w-10/12 mx-auto">
        <div className="flex-1 md:text-left text-center">
          <h2 className="font-medium md:text-4xl text-3xl text-slate-800">FAQ</h2>
          <p className="mt-2 text-sm text-base-light md:w-8/12 w-11/12 md:mx-0 mx-auto">Got questions? We've got answers.
            Find quick answers to common questions here.</p>
        </div>
        <div className="flex-1 md:text-left text-center md:mx-0 mx-auto md:mt-0 mt-8 w-11/12 md:w-full">
          <DropDown question='Do You Work With Money?' answer='Our team group of creative people, consisting of various backgrounds and specific abilities that are divided into several divisions.' />
          <DropDown question='Do You Work With Money?' answer='Our team group of creative people, consisting of various backgrounds and specific abilities that are divided into several divisions.' />
          <DropDown question='Do You Work With Money?' answer='Our team group of creative people, consisting of various backgrounds and specific abilities that are divided into several divisions.' />
        </div>
      </div>
  )
}

export default FAQ