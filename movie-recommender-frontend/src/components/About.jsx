import React from "react";
import NavBar from "./NavBar";

const About = () => {
  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 py-12" style={{ backgroundImage: "url('/background-image.jpg')" }}>
      <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-8">
        About Us: Bringing Cinematic Magic to Your Fingertips
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Box 1 */}
        <div className="bg-black/50 p-6 rounded-lg shadow-lg">
          <p className="text-white text-lg leading-relaxed">
            In a world full of streaming services and endless choices, who will guide you to your next great movie? That’s where we come in, your friendly neighborhood movie enthusiasts! Whether you’re assembling your cinematic <span className="text-orange-500 font-bold">Avengers</span>, stepping into the Wizarding World of <span className="text-orange-500 font-bold">Harry Potter</span>, or setting off on a journey through <span className="text-orange-500 font-bold">Middle-earth</span>, we’re here to ensure you never miss a masterpiece.
          </p>
        </div>

        {/* Box 2 */}
        <div className="bg-black/50 p-6 rounded-lg shadow-lg">
          <p className="text-white text-lg leading-relaxed">
            Our Movie Recommender isn’t just a tool—it’s your companion in the multiverse of cinema. Powered by advanced algorithms and a deep love for storytelling, we match you with movies that align with your tastes. From classics that made <span className="text-orange-500 font-bold">The Godfather</span> proud to modern hits that would make <span className="text-orange-500 font-bold">Tony Stark</span> smile, our recommendations are crafted for every kind of viewer.
          </p>
        </div>

        {/* Box 3 */}
        <div className="bg-black/50 p-6 rounded-lg shadow-lg">
          <p className="text-white text-lg leading-relaxed">
            Why do we do this? Because, like Samwise Gamgee once said, <span className="italic">‘There’s some good in this world, Mr. Frodo, and it’s worth fighting for.’</span> And we believe good stories—ones that make us laugh, cry, and feel—are worth sharing.
          </p>
        </div>

        {/* Box 4 */}
        <div className="bg-black/50 p-6 rounded-lg shadow-lg">
          <p className="text-white text-lg leading-relaxed">
            So, whether you’re in the mood for a movie night filled with laughs, an epic battle for the fate of the universe, or a love story to remember, we’ve got you covered. Let’s make every movie night a blockbuster. And as <span className="text-orange-500 font-bold">Gandalf</span> once said, <span className="italic">"All we have to decide is what to watch with the time that is given to us."</span> Ready? Let’s roll the credits on boredom!
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default About;