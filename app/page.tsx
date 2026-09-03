"use client";

import Image from "next/image";
import {
  ArrowRight, Check, ChevronRight, Heart, Minus, PackageCheck, Plus,
  Search, ShieldCheck, ShoppingBag, Sparkles, Star, Trash2, Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Cart = Record<number, number>;

const products = [
  { id: 1, name: "NOVA Air Pro", category: "Аудио", description: "Пространственный звук, ANC и до 38 часов работы.", price: 12990, oldPrice: 15990, image: "/headphones.png", rating: 4.9, badge: "Хит" },
  { id: 2, name: "NOVA Keys 75", category: "Для ПК", description: "Алюминиевый корпус, hot-swap и мягкий ход клавиш.", price: 8490, oldPrice: 9990, image: "/keyboard.png", rating: 4.8, badge: "−15%" },
  { id: 3, name: "NOVA Watch One", category: "Гаджеты", description: "AMOLED-экран, GPS и мониторинг активности 24/7.", price: 10990, oldPrice: 12990, image: "/watch.png", rating: 4.7, badge: "Новинка" },
  { id: 4, name: "NOVA Pulse Mini", category: "Аудио", description: "Объёмный звук, защита IP67 и 18 часов музыки.", price: 6990, oldPrice: 7990, image: "/speaker.png", rating: 4.8, badge: "Выбор NOVA" },
  { id: 5, name: "NOVA Flux", category: "Для ПК", description: "Сенсор 26K DPI, 58 грамм и подключение без задержки.", price: 5490, oldPrice: 6490, image: "/mouse.png", rating: 4.9, badge: "Топ" },
  { id: 6, name: "NOVA Core 20K", category: "Гаджеты", description: "20 000 мА·ч, быстрая зарядка 65 Вт и два USB-C.", price: 5990, oldPrice: 7490, image: "/powerbank.png", rating: 4.6, badge: "−20%" },
];

const categories = ["Все", "Аудио", "Для ПК", "Гаджеты"];
const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

export default function Home() {
  const [cart, setCart] = useState<Cart>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [promo, setPromo] = useState("");
  const [promoActive, setPromoActive] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("nova-cart") || "{}"));
      setFavorites(JSON.parse(localStorage.getItem("nova-favorites") || "[]"));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("nova-cart", JSON.stringify(cart));
    localStorage.setItem("nova-favorites", JSON.stringify(favorites));
  }, [cart, favorites, hydrated]);

  const visibleProducts = products.filter((product) => {
    const inCategory = category === "Все" || product.category === category;
    const inSearch = `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase().trim());
    return inCategory && inSearch;
  });
  const cartItems = products.filter((product) => cart[product.id]);
  const count = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const subtotal = useMemo(() => products.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0), [cart]);
  const discount = promoActive ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;
  const freeDeliveryLeft = Math.max(0, 10000 - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / 10000) * 100);

  function changeQuantity(id: number, delta: number) {
    setOrdered(false);
    setCart((current) => {
      const quantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current, [id]: quantity };
      if (!quantity) delete next[id];
      return next;
    });
  }

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function applyPromo() {
    setPromoActive(promo.trim().toUpperCase() === "NOVA10");
  }

  const CartContent = () => (
    <>
      <div className="cart-heading">
        <div><p>Твой заказ</p><h2>Корзина</h2></div>
        <span>{count}</span>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-cart"><ShoppingBag size={28} /><p>Здесь пока пусто</p><span>Добавь что-нибудь из каталога</span></div>
      ) : (
        <>
          <div className="delivery">
            <div><Truck size={16} /><span>{freeDeliveryLeft ? <>Ещё {money.format(freeDeliveryLeft)} до бесплатной доставки</> : "Доставка бесплатная"}</span></div>
            <div className="progress"><i style={{ width: `${deliveryProgress}%` }} /></div>
          </div>
          <div className="cart-items">
            {cartItems.map((product) => (
              <div className="cart-item" key={product.id}>
                <Image src={product.image} alt="" width={62} height={62} />
                <div className="cart-item-main">
                  <strong>{product.name}</strong><span>{money.format(product.price)}</span>
                  <div className="quantity">
                    <button onClick={() => changeQuantity(product.id, -1)} aria-label="Уменьшить"><Minus size={14} /></button>
                    <span>{cart[product.id]}</span>
                    <button onClick={() => changeQuantity(product.id, 1)} aria-label="Увеличить"><Plus size={14} /></button>
                  </div>
                </div>
                <button className="remove" onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })} aria-label="Удалить"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <div className="promo">
            <input value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Промокод: NOVA10" aria-label="Промокод" />
            <button onClick={applyPromo}>{promoActive ? <Check size={18} /> : <ArrowRight size={18} />}</button>
          </div>
          {promo && !promoActive && promo.trim().toUpperCase() !== "NOVA10" && <p className="promo-error">Попробуй промокод NOVA10</p>}
          <div className="totals">
            {discount > 0 && <div><span>Скидка</span><strong className="discount">−{money.format(discount)}</strong></div>}
            <div className="cart-total"><span>Итого</span><strong>{money.format(total)}</strong></div>
          </div>
          <button className="checkout" onClick={() => setOrdered(true)}>{ordered ? <><Check size={19} /> Заказ оформлен</> : <>Перейти к оплате <ChevronRight size={18} /></>}</button>
          <p className="demo-note">Демо-версия — деньги не списываются</p>
        </>
      )}
    </>
  );

  return (
    <main>
      <div className="announcement"><Sparkles size={14} /> Промокод NOVA10 — скидка 10% на весь заказ</div>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="NOVA — на главную"><span className="brand-mark">N</span><span>NOVA</span></a>
        <nav><a href="#catalog">Каталог</a><a href="#benefits">Преимущества</a></nav>
        <button className="cart-link" onClick={() => setMobileCartOpen(true)}><ShoppingBag size={19} /><span className="cart-label">Корзина</span><b>{count}</b></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Технологии без компромиссов</p>
          <h1>Будущее.<br /><span>Уже в руках.</span></h1>
          <p>Продуманные гаджеты для музыки, работы и движения. Чистый дизайн, мощные характеристики и честная гарантия.</p>
          <a href="#catalog">Смотреть коллекцию <ArrowRight size={18} /></a>
        </div>
        <div className="hero-product">
          <div className="orb" />
          <Image src="/headphones.png" alt="NOVA Air Pro" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="floating-card"><span>Флагман коллекции</span><strong>NOVA Air Pro</strong><b>{money.format(12990)}</b></div>
        </div>
      </section>

      <section className="benefits" id="benefits">
        <div><Truck /><span><strong>Быстрая доставка</strong><small>1–3 дня по России</small></span></div>
        <div><ShieldCheck /><span><strong>Гарантия 2 года</strong><small>Обмен без лишних вопросов</small></span></div>
        <div><PackageCheck /><span><strong>Проверка перед отправкой</strong><small>Каждого устройства</small></span></div>
      </section>

      <section className="catalog-wrap" id="catalog">
        <div className="catalog-top">
          <div><p className="eyebrow">Коллекция 2026</p><h2>Выбери своё</h2></div>
          <div className="search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти товар" aria-label="Поиск товаров" />{query && <button onClick={() => setQuery("")} aria-label="Очистить поиск"><X size={16} /></button>}</div>
        </div>
        <div className="filters">
          {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>

        <div className="store-layout">
          <section className="catalog-results" aria-label="Товары">
            <div className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? "товар" : "товаров"}</div>
            {visibleProducts.length ? (
              <div className="product-grid">
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image">
                      <span className="badge">{product.badge}</span>
                      <button className={favorites.includes(product.id) ? "favorite active" : "favorite"} onClick={() => toggleFavorite(product.id)} aria-label="В избранное"><Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button>
                      <Image src={product.image} alt={product.name} fill sizes="(max-width: 760px) 100vw, 33vw" priority={index < 2} />
                    </div>
                    <div className="product-info">
                      <div className="meta"><p className="category">{product.category}</p><span><Star size={13} fill="currentColor" /> {product.rating}</span></div>
                      <h3>{product.name}</h3><p className="description">{product.description}</p>
                      <div className="price-row">
                        <div><strong>{money.format(product.price)}</strong><s>{money.format(product.oldPrice)}</s></div>
                        {cart[product.id] ? (
                          <div className="card-quantity"><button onClick={() => changeQuantity(product.id, -1)}><Minus size={17} /></button><span>{cart[product.id]}</span><button onClick={() => changeQuantity(product.id, 1)}><Plus size={17} /></button></div>
                        ) : (
                          <button className="add-button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Добавить ${product.name}`}><ShoppingBag size={18} /><span>В корзину</span></button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : <div className="no-results"><Search size={30} /><h3>Ничего не найдено</h3><p>Попробуй другой запрос или категорию</p><button onClick={() => { setQuery(""); setCategory("Все"); }}>Сбросить фильтры</button></div>}
          </section>
          <aside className="cart desktop-cart"><CartContent /></aside>
        </div>
      </section>

      <button className="mobile-cart-button" onClick={() => setMobileCartOpen(true)}><ShoppingBag size={20} /><span>Корзина · {count}</span>{count > 0 && <strong>{money.format(total)}</strong>}</button>
      {mobileCartOpen && <div className="drawer-backdrop" onClick={() => setMobileCartOpen(false)} />}
      <aside className={mobileCartOpen ? "cart-drawer open" : "cart-drawer"} aria-hidden={!mobileCartOpen}>
        <button className="drawer-close" onClick={() => setMobileCartOpen(false)} aria-label="Закрыть"><X /></button><CartContent />
      </aside>

      <footer><a className="brand" href="#top"><span className="brand-mark">N</span><span>NOVA</span></a><p>Демо-магазин нового поколения на Next.js</p><span>© 2026</span></footer>
    </main>
  );
}
