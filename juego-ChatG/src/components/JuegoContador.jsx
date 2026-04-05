import { useState, useEffect } from "react";

function JuegoContador() {
  const [tiempo, setTiempo] = useState(0);
  const [jugando, setJugando] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [record, setRecord] = useState(0);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let intervalo;
    if (jugando && tiempo > 0) {
      intervalo = setInterval(() => setTiempo(prev => prev - 1), 1000);
    }
    if (tiempo === 0 && jugando) {
      setJugando(false);
      setMensaje("⏰ Tiempo terminado");
      if (clicks > record) setRecord(clicks);
    }
    return () => clearInterval(intervalo);
  }, [jugando, tiempo]);

  const iniciarJuego = () => {
    setTiempo(5);
    setClicks(0);
    setJugando(true);
    setMensaje("🔥 ¡YA!");
  };

  const manejarClick = () => {
    if (jugando) setClicks(clicks + 1);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{mensaje}</h2>
      <h3>⏱ Tiempo: {tiempo}</h3>
      <h3>🖱 Clicks: {clicks}</h3>
      <h3>🏆 Record: {record}</h3>
      <button onClick={iniciarJuego} disabled={jugando}>Iniciar juego</button>
      <br /><br />
      <button onClick={manejarClick} disabled={!jugando}>CLICK!!</button>
    </div>
  );
}

export default JuegoContador;