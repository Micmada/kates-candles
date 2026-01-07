import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-neutral-50 min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}></div>
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-8 py-32 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <div className="overflow-hidden mb-8">
              <h1 className="text-7xl md:text-9xl tracking-tight font-light hero-text">
                Kate's Candles
              </h1>
            </div>
            <div className="overflow-hidden mb-12">
              <p className="text-xl md:text-2xl text-neutral-400 tracking-wide font-light hero-text-delay">
                Handcrafted candles for discerning spaces
              </p>
            </div>
            
            <div className="overflow-hidden hero-cta">
              <Link
                to="/shop"
                className="inline-block border-2 border-neutral-50 text-neutral-50 px-12 py-4 text-sm tracking-widest uppercase hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-500"
              >
                Explore Collection
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-indicator">
            <div className="flex flex-col items-center gap-2 text-neutral-500">
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-neutral-900 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest uppercase text-neutral-400">Natural Materials</h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                100% natural soy wax and premium essential oils sourced from sustainable suppliers
              </p>
            </div>
            
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-neutral-900 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest uppercase text-neutral-400">Hand Poured</h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                Each candle is meticulously crafted by skilled artisans in small batches
              </p>
            </div>
            
            <div className="space-y-4 fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-neutral-900 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest uppercase text-neutral-400">Sustainability</h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                Eco-conscious practices with recyclable packaging and carbon-neutral shipping
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-neutral-100">
        <div className="max-w-[1400px] mx-auto px-8 py-32">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 fade-in">
              <div>
                <h2 className="text-5xl md:text-6xl tracking-tight font-light text-neutral-900 mb-4">
                  The art of ambiance
                </h2>
                <div className="w-24 h-px bg-neutral-900"></div>
              </div>
              
              <div className="space-y-6 text-neutral-600 leading-relaxed text-lg font-light">
                <p>
                  At Kate's Candles, we believe that light and scent have the power to transform 
                  spaces and moments. Each candle is more than a product—it's an experience 
                  carefully designed to elevate your everyday rituals.
                </p>
                <p>
                  Our master chandlers hand-pour every piece in small batches, ensuring 
                  uncompromising quality and attention to detail. From the selection of 
                  premium soy wax to the curation of sophisticated fragrance profiles, 
                  we craft candles worthy of the most discerning spaces.
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-block border border-neutral-900 text-neutral-900 px-10 py-3 text-sm tracking-widest uppercase hover:bg-neutral-900 hover:text-neutral-50 transition-all duration-300"
              >
                Discover Our Story
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-8 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-4 pt-16">
                <div 
                  className="text-6xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  48h
                </div>
                <div className="text-sm tracking-wide text-neutral-500 uppercase">Cure Time</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Allowing optimal fragrance development
                </p>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="text-6xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  100%
                </div>
                <div className="text-sm tracking-wide text-neutral-500 uppercase">Natural Wax</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pure soy wax from sustainable sources
                </p>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="text-6xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  50+
                </div>
                <div className="text-sm tracking-wide text-neutral-500 uppercase">Hour Burn</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Extended burn time for lasting enjoyment
                </p>
              </div>
              
              <div className="space-y-4 pt-16">
                <div 
                  className="text-6xl tracking-tight font-light text-neutral-900"
                  style={{ fontFamily: "'Cormorant', serif" }}
                >
                  ∞
                </div>
                <div className="text-sm tracking-wide text-neutral-500 uppercase">Reusable</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Vessels designed for a second life
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="max-w-[1400px] mx-auto px-8 py-32">
          <div className="max-w-3xl mx-auto text-center fade-in">
            <blockquote>
              <p 
                className="text-3xl md:text-4xl tracking-tight font-light text-neutral-900 mb-8 leading-relaxed"
                style={{ fontFamily: "'Cormorant', serif" }}
              >
                "A candle loses nothing by lighting another candle"
              </p>
              <footer className="text-sm tracking-widest uppercase text-neutral-400">
                James Keller
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section>
        <div className="max-w-[1400px] mx-auto px-8 py-32">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center fade-in">
              <h2 className="text-5xl md:text-6xl tracking-tight font-light text-neutral-900 mb-4">
                Crafted with intention
              </h2>
              <div className="w-24 h-px bg-neutral-900 mx-auto mb-8"></div>
              <p className="text-neutral-600 leading-relaxed text-lg font-light max-w-2xl mx-auto">
                Every Kate's Candles candle undergoes a meticulous process of creation, 
                from fragrance formulation to final pour.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4 fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-6xl text-neutral-900 mb-4">01</div>
                <h3 className="text-lg tracking-wide text-neutral-900">Fragrance Selection</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Each scent is carefully composed using premium essential oils and 
                  fragrance notes, tested extensively for depth and longevity.
                </p>
              </div>

              <div className="text-center space-y-4 fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-6xl text-neutral-900 mb-4">02</div>
                <h3 className="text-lg tracking-wide text-neutral-900">Hand Pouring</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Our artisans pour each candle individually, monitoring temperature 
                  and ensuring perfect distribution of fragrance throughout.
                </p>
              </div>

              <div className="text-center space-y-4 fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-6xl text-neutral-900 mb-4">03</div>
                <h3 className="text-lg tracking-wide text-neutral-900">Curation</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  After a 48-hour cure, each candle is inspected, trimmed, and 
                  packaged with care before reaching you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 text-neutral-50">
        <div className="max-w-[1400px] mx-auto px-8 py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8 fade-in">
            <h2 className="text-5xl md:text-6xl tracking-tight font-light">
              Begin your journey
            </h2>
            <p className="text-xl text-neutral-400 tracking-wide font-light">
              Discover our collection of handcrafted candles
            </p>
            <Link
              to="/shop"
              className="inline-block border-2 border-neutral-50 text-neutral-50 px-12 py-4 text-sm tracking-widest uppercase hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-500"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500&family=Inter:wght@300;400&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        h1, h2, blockquote p {
          font-family: 'Cormorant', serif;
          font-weight: 300;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .hero-text {
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .hero-text-delay {
          animation: fadeInUp 1.2s ease-out 0.3s forwards;
          opacity: 0;
        }

        .hero-cta {
          animation: fadeInUp 1.2s ease-out 0.6s forwards;
          opacity: 0;
        }

        .scroll-indicator {
          animation: fadeIn 1.5s ease-out 1.5s forwards;
          opacity: 0;
        }

        .fade-in {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        ::-webkit-scrollbar-thumb {
          background: #262626;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #171717;
        }
      `}</style>
    </div>
  );
}

export default Home;