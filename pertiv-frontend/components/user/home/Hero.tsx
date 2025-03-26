import Image from 'next/image';
import hero from '../../../public/assets/hero.png';
const Hero = () => {
  return (
    <>
      <section className="bg-gray-50 p-3">
        <div className="container">
          <div className="flex gap-2 items-center flex-wrap justify-center">
            <h1 className="font-bold text-xl">
              Explore the world through books
            </h1>
            <div>
              <Image src={hero} alt="hero" width={300} height={300} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
