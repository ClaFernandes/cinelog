import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

function MoviePage() {
    return (
        <>
            <Header variant="detail" />
            <div>
                <h1>Detalhes do Filme</h1>
                <p>Informações sobre o filme selecionado.</p>
            </div>
            <Footer />
        </>

    );
}

export default MoviePage;
