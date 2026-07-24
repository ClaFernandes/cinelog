import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function HomePage() {
    return (
        <>
            <Header variant="home" />
            <div>
                <h1>Bem-vindo ao Cinelog</h1>
                <p>Seu diário de filmes favorito!</p>
            </div>
            <Footer />
        </>
    );
}

export default HomePage;

