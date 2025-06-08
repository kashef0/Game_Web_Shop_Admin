# 🛠️ Game Web Shop – Adminpanel

Detta är en separat adminklient för hantering av spel, beställningar och användare i spelplattformen **Game Web Shop**. Panelen är byggd med **React**, **TypeScript**, **Redux Toolkit** och **Bootstrap**, och kommunicerar med samma backend-API som kundvyn.

## 🧩 Funktionalitet

- 🔐 Inloggning med rollbaserad autentisering (admin)
- ➕ Skapa nya spel från RAWG API
- ✏️ Uppdatera spel: pris, hyrespris, lager, status
- ❌ Radera spel (eller dölja via isActive)
- 📦 Hantera beställningar: markera som levererade
- 👤 Skapa nya admin-konton via hemlig nyckel
- 🌐 Responsivt gränssnitt med Bootstrap

## ⚙️ Teknikstack

| Teknik           | Beskrivning                                           |
|------------------|-------------------------------------------------------|
| **React**        | SPA-struktur med komponentbaserad logik              |
| **TypeScript**   | Typning för bättre förutsägbarhet och kodkvalitet    |
| **Redux Toolkit**| Global hantering av autentisering och speldata       |
| **Bootstrap 5**  | UI-komponenter och responsiv layout                  |
| **Fetch API**    | Kommunikation med backend via egna hooks             |

## 🚀 Kom igång

### 1. Klona repot

```bash
git clone https://github.com/kashef0/Game_Web_Shop_Admin.git
cd Game_Web_Shop/admin  
