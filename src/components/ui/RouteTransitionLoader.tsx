import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BouncingBallsLoader } from "./BouncingBallsLoader";

/**
 * Componente que detecta mudanças de rota e mostra o loading durante as transições
 * DESABILITADO: Este componente causava loading infinito em algumas situações
 */
export function RouteTransitionLoader() {
  // Retornar null para desabilitar o loader de transição
  // As páginas individuais já têm seus próprios loaders quando necessário
  return null;
}
