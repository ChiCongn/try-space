import { motion, type Variants } from "framer-motion";
import { ArrowRight, Camera, Cuboid, Ruler } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
    y: 0,
  },
};

const container: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
};

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link className="site-logo" to="/">
          TrySpace
        </Link>
        <nav>
          <Link to="/catalog">Catalog</Link>
          <Link to="/login">Đăng nhập</Link>
        </nav>
      </header>

      <section className="landing-hero">
        <motion.div
          animate="show"
          className="landing-copy"
          initial="hidden"
          variants={container}
        >
          <motion.span variants={fadeUp}>AR furniture preview</motion.span>
          <motion.h1 variants={fadeUp}>
            Thử nội thất trong phòng thật trước khi mua.
          </motion.h1>
          <motion.p variants={fadeUp}>
            Chọn sofa, ghế, bàn, kệ hoặc đèn; mở camera điện thoại và xem kích
            thước 1:1 ngay trong không gian của bạn.
          </motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <Link className="primary-link" to="/catalog">
              Khám phá ngay <ArrowRight size={17} />
            </Link>
            <Link className="ghost-link" to="/ar/ghe-eames-replica">
              Xem demo
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="hero-showcase"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="showcase-phone">
            <div className="scan-frame" />
            <span>Tap để đặt</span>
          </div>
          <div className="showcase-card">
            <span>Live AR</span>
            <strong>Nordic sofa · 1:1 scale</strong>
          </div>
        </motion.div>
      </section>

      <section className="landing-stats" aria-label="TrySpace stats">
        <div>
          <strong>12+</strong>
          <span>Mẫu demo</span>
        </div>
        <div>
          <strong>1:1</strong>
          <span>Tỉ lệ AR</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Bước thử phòng</span>
        </div>
      </section>

      <section className="feature-grid">
        <article>
          <Camera />
          <h2>Thử trước mua sau</h2>
          <p>Mở AR để kiểm tra món đồ có hợp phòng trước khi quyết định.</p>
        </article>
        <article>
          <Ruler />
          <h2>Kích thước thật 1:1</h2>
          <p>Thông số cm rõ ràng và viewer giúp so tỉ lệ nhanh hơn.</p>
        </article>
        <article>
          <Cuboid />
          <h2>Nhiều mẫu mã</h2>
          <p>Mock catalog đa dạng GLB cho sofa, ghế, bàn, kệ và đèn.</p>
        </article>
      </section>

      <section className="how-section">
        <h2>Cách hoạt động</h2>
        <div>
          <article>
            <span>01</span>
            <strong>Chọn sản phẩm</strong>
          </article>
          <article>
            <span>02</span>
            <strong>Mở camera</strong>
          </article>
          <article>
            <span>03</span>
            <strong>Đặt vào phòng</strong>
          </article>
        </div>
      </section>

      <section className="cta-banner">
        <h2>Bắt đầu thiết kế không gian của bạn</h2>
        <Link className="primary-link" to="/catalog">
          Mở catalog
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">TrySpace</span>

            <p>
              Trải nghiệm nội thất AR trực tiếp trong không gian thật của bạn.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TrySpace. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
