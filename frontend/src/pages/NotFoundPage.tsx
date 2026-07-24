import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './NotFoundPage.css';

function NotFoundPage() {
    return (
        <>
            <Header variant="home" />
            <div className="not-found">
                <h1 className="not-found-code">404</h1>
                <p className="not-found-message">Página não encontrada.</p>
                <Link to="/" className="not-found-link">
                    Voltar para a Home
                </Link>
            </div>
            <Footer />
        </>
    );
}

export default NotFoundPage;