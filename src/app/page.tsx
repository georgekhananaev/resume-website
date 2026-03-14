import About from '../components/Sections/About';
import Contact from '../components/Sections/Contact';
import FavoriteTech from '../components/Sections/FavoriteTech';
import Footer from '../components/Sections/Footer';
import GithubStats from '../components/Sections/GithubStats';
import Header from '../components/Sections/Header';
import Hero from '../components/Sections/Hero';
import Portfolio from '../components/Sections/Portfolio';
import Resume from '../components/Sections/Resume';
import Testimonials from '../components/Sections/Testimonials';

export default function Home() {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Resume />
            <FavoriteTech />
            <GithubStats />
            <Portfolio />
            <Testimonials />
            <Contact />
            <Footer />
        </>
    );
}
