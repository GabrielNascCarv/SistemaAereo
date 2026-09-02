import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FluxoReservaProvider } from './context/fluxo-reserva.context';
import { BuscaVoosPage } from './pages/BuscaVoosPage';
import { ResultadosPage } from './pages/ResultadosPage';
import { ReservarPage } from './pages/ReservarPage';
import { ConfirmacaoPage } from './pages/ConfirmacaoPage';
import { PagamentoPage } from './pages/PagamentoPage';
import { ReservasPage } from './pages/ReservasPage';

function App() {
  return (
    <FluxoReservaProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<BuscaVoosPage />} />
            <Route path="resultados" element={<ResultadosPage />} />
            <Route path="reservar" element={<ReservarPage />} />
            <Route path="confirmacao" element={<ConfirmacaoPage />} />
            <Route path="pagamento" element={<PagamentoPage />} />
            <Route path="reservas" element={<ReservasPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FluxoReservaProvider>
  );
}

export default App;
