import { Film, Star, Search, Sparkles } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-page-wrapper">
            <Header variant="detail" />
            <div className="about-page">
                <div className="about-hero">
                    <h1 className="about-title">Sobre o Cinelog</h1>
                    <p className="about-tagline">
                        Um diário pessoal de filmes e séries, com dados preenchidos
                        automaticamente pela API do TMDB.
                    </p>
                </div>

                <section className="about-section">
                    <p className="about-text">
                        O Cinelog nasceu de uma ideia simples: registar o que você já assistiu,
                        está assistindo ou planeia assistir — filmes e séries — sem precisar
                        digitar manualmente poster, ano, sinopse ou elenco.
                    </p>
                    <p className="about-text">
                        Este projeto foi desenvolvido como peça de portfólio, com foco em
                        TypeScript de ponta a ponta (frontend e backend), integração com
                        API externa e um design system autoral.
                    </p>
                </section>

                <section className="about-section">
                    <h2 className="about-section-title">O que dá pra fazer</h2>
                    <div className="about-features">
                        <div className="about-feature">
                            <Search size={20} className="about-feature-icon" />
                            <div>
                                <strong>Busca inteligente</strong>
                                <p>Encontre qualquer filme ou série na TMDB e adicione à sua coleção em segundos.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <Film size={20} className="about-feature-icon" />
                            <div>
                                <strong>Status de acompanhamento</strong>
                                <p>Organize entre "quero ver", "assistindo" e "assistido".</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <Star size={20} className="about-feature-icon" />
                            <div>
                                <strong>Avaliação e resenha</strong>
                                <p>Dê uma nota de 1 a 5 estrelas e escreva sua opinião pessoal.</p>
                            </div>
                        </div>
                        <div className="about-feature">
                            <Sparkles size={20} className="about-feature-icon" />
                            <div>
                                <strong>Recomendações</strong>
                                <p>Descubra títulos semelhantes e adicione-os com um clique.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="about-section-title">Stack técnica</h2>
                    <ul className="about-list">
                        <li><strong>Frontend</strong> — React, TypeScript, Vite, React Router</li>
                        <li><strong>Backend</strong> — Node.js, Express, TypeScript</li>
                        <li><strong>Banco de dados</strong> — MongoDB Atlas via Mongoose</li>
                        <li><strong>API externa</strong> — TMDB (The Movie Database)</li>
                    </ul>
                </section>

                <p className="about-credit">
                    Este produto usa a API do TMDB, mas não é endossado ou certificado pelo TMDB.
                </p>
            </div>
            <Footer />
        </div>
    );
}

export default AboutPage;
