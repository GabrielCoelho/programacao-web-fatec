let expression = '';
let history = [];

const currentDisplay = document.getElementById('currentDisplay');
const previousDisplay = document.getElementById('previousDisplay');
const historyList = document.getElementById('historyList');
const errorAlert = document.getElementById('errorAlert');

function showError(message) {
  errorAlert.textContent = message;
  errorAlert.classList.add('show');

  setTimeout(() => {
    errorAlert.classList.remove('show');
  }, 3000);
}

function updateDisplay() {
  currentDisplay.textContent = expression || '0';
}

function appendChar(char) {
  // Lógica especial para operadores
  const operators = ['+', '-', '*', '/', '^'];
  const lastChar = expression.slice(-1);

  // Não permite operadores consecutivos (exceto menos após operador para números negativos)
  if (operators.includes(char) && operators.includes(lastChar)) {
    if (char === '-' && lastChar !== '-') {
      // Permite minus depois de operador para número negativo
      expression += char;
    } else {
      // Substitui o último operador
      expression = expression.slice(0, -1) + char;
    }
  } else if (char === '.' && lastChar === '.') {
    // Não permite pontos consecutivos
    return;
  } else {
    expression += char;
  }

  updateDisplay();
}

function deleteDigit() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function clearCalculator() {
  expression = '';
  previousDisplay.textContent = '';
  updateDisplay();
}

function applySquareRoot() {
  if (!expression || expression === '0') {
    showError('⚠️ Digite um número antes de calcular a raiz!');
    return;
  }

  // Adiciona a raiz quadrada à expressão
  expression = `√(${expression})`;
  updateDisplay();
}

function applyPercent() {
  if (!expression || expression === '0') {
    showError('⚠️ Digite um número antes de aplicar porcentagem!');
    return;
  }

  // Adiciona o operador de porcentagem
  expression += '%';
  updateDisplay();
}

function evaluateExpression(expr) {
  // Substitui símbolos visuais por operadores JavaScript
  expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Processa raiz quadrada
  expr = expr.replace(/√\(([^)]+)\)/g, (match, p1) => {
    const value = evaluateExpression(p1);
    if (value < 0) {
      throw new Error('Raiz quadrada de número negativo');
    }
    return Math.sqrt(value);
  });

  // Processa porcentagem
  expr = expr.replace(/(\d+\.?\d*)%/g, (match, p1) => {
    return parseFloat(p1) / 100;
  });

  // Processa potência (transforma ^ em **)
  expr = expr.replace(/\^/g, '**');

  // Valida parênteses balanceados
  let openCount = (expr.match(/\(/g) || []).length;
  let closeCount = (expr.match(/\)/g) || []).length;
  if (openCount !== closeCount) {
    throw new Error('Parênteses desbalanceados');
  }

  // Valida expressão antes de avaliar
  if (/[+\-*/^]{2,}/.test(expr.replace(/\*\*/g, '^'))) {
    // Permite -- para números negativos, mas não outros operadores duplos
    if (!/--/.test(expr)) {
      throw new Error('Operadores consecutivos inválidos');
    }
  }

  try {
    // Usa Function para avaliar a expressão com segurança
    const result = Function('"use strict"; return (' + expr + ')')();

    if (!isFinite(result)) {
      throw new Error('Resultado inválido');
    }

    return result;
  } catch (e) {
    throw new Error('Expressão inválida');
  }
}

function calculate() {
  if (!expression || expression === '0') {
    showError('⚠️ Digite uma expressão para calcular!');
    return;
  }

  try {
    const result = evaluateExpression(expression);

    // Adiciona ao histórico
    addToHistory(expression, result);

    // Mostra o resultado
    previousDisplay.textContent = expression + ' =';
    expression = result.toString();
    updateDisplay();
  } catch (error) {
    if (error.message === 'Raiz quadrada de número negativo') {
      showError(
        '⚠️ Erro: Não é possível calcular raiz quadrada de número negativo!'
      );
    } else if (error.message === 'Parênteses desbalanceados') {
      showError('⚠️ Erro: Parênteses desbalanceados!');
    } else if (
      error.message.includes('division by zero') ||
      expression.includes('/0')
    ) {
      showError('⚠️ Erro: Não é possível dividir por zero!');
    } else if (error.message === 'Resultado inválido') {
      showError('⚠️ Erro: Operação resultou em valor inválido!');
    } else {
      showError('⚠️ Erro: Expressão inválida!');
    }

    clearCalculator();
  }
}

function addToHistory(expr, result) {
  const historyItem = {
    expression: expr,
    result: result,
    timestamp: new Date(),
  };

  history.unshift(historyItem);

  if (history.length > 50) {
    history.pop();
  }

  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  if (history.length === 0) {
    historyList.innerHTML =
      '<div class="empty-history">Nenhum cálculo realizado ainda</div>';
    return;
  }

  historyList.innerHTML = history
    .map(
      (item) => `
                <div class="history-item">
                    <div class="history-expression">${item.expression}</div>
                    <div class="history-result">= ${formatNumber(item.result)}</div>
                </div>
            `
    )
    .join('');
}

function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return parseFloat(num.toFixed(8)).toString();
}

function clearHistory() {
  if (history.length === 0) return;

  if (confirm('Deseja limpar todo o histórico?')) {
    history = [];
    updateHistoryDisplay();
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key >= '0' && event.key <= '9') {
    appendChar(event.key);
  } else if (event.key === '.') {
    appendChar('.');
  } else if (
    event.key === '+' ||
    event.key === '-' ||
    event.key === '*' ||
    event.key === '/'
  ) {
    appendChar(event.key);
  } else if (event.key === '(' || event.key === ')') {
    appendChar(event.key);
  } else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculate();
  } else if (event.key === 'Backspace') {
    deleteDigit();
  } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
    clearCalculator();
  } else if (event.key === '%') {
    applyPercent();
  } else if (event.key === '^') {
    appendChar('^');
  }
});

updateDisplay();
