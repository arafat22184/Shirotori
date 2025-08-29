import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosTimer } from "react-icons/io";
import Swal from "sweetalert2";

const TOTAL_TIME = 25;
const BASE_POINTS = 4;
const INITIAL_SCORE = 100;

const Home = () => {
  const [players, setPlayers] = useState([
    { name: "Player 1", score: INITIAL_SCORE },
    { name: "Player 2", score: INITIAL_SCORE },
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [inputs, setInputs] = useState(["", ""]);
  const [history, setHistory] = useState([]);
  const historySet = useRef(new Set());
  const [lastLetter, setLastLetter] = useState("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);
  const [messages, setMessages] = useState(["", ""]);
  const [loadingValidation, setLoadingValidation] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Start game with SweetAlert
  const startGame = () => {
    const randomLetter = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    );
    setLastLetter(randomLetter);
    setGameStarted(true);
    Swal.fire({
      title: `Game Started!`,
      html: `<div class="text-4xl my-4 font-bold text-blue-500">${randomLetter.toUpperCase()}</div><p>First letter</p>`,
      icon: "info",
      confirmButtonText: "Let's Play!",
      confirmButtonColor: "#3B82F6",
    });
  };

  // Timer for each turn
  useEffect(() => {
    if (!gameStarted) return;
    setTimeLeft(TOTAL_TIME);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentPlayer, gameStarted]);

  // Handle timeout
  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleTimeout();
    }
  }, [timeLeft]);

  function switchTurn() {
    setCurrentPlayer((p) => (p === 0 ? 1 : 0));
    setInputs(["", ""]);
    setMessages(["", ""]);
  }

  function applyScoreForPlayer(idx, delta) {
    setPlayers((prev) => {
      const nxt = [...prev];
      nxt[idx] = { ...nxt[idx], score: nxt[idx].score - delta };
      return nxt;
    });
    checkWinner(players[idx].score - delta, idx);
  }

  function checkWinner(score, idx) {
    if (score <= 0) {
      const winner = players[idx === 0 ? 1 : 0].name;
      Swal.fire({
        title: `${winner} Wins!`,
        icon: "success",
        html: `<div class="flex justify-center my-4"><GiLaurelsTrophy class="text-5xl text-yellow-400" /></div>`,
        confirmButtonText: "Play Again",
        confirmButtonColor: "#10B981",
      }).then(() => {
        resetGame();
      });
    }
  }

  function resetGame() {
    setPlayers([
      { name: "Player 1", score: INITIAL_SCORE },
      { name: "Player 2", score: INITIAL_SCORE },
    ]);
    setCurrentPlayer(0);
    setInputs(["", ""]);
    setHistory([]);
    historySet.current = new Set();
    setLastLetter("");
    setTimeLeft(TOTAL_TIME);
    setMessages(["", ""]);
    setGameStarted(false);
    clearInterval(timerRef.current);
  }

  async function validateWordMeaning(word) {
    setLoadingValidation(true);
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word
        )}`
      );
      if (!res.ok) {
        setLoadingValidation(false);
        return false;
      }
      const data = await res.json();
      setLoadingValidation(false);
      return Array.isArray(data) && data.length > 0 && data[0].meanings;
    } catch (e) {
      e && setLoadingValidation(false);
      return false;
    }
  }

  async function handleSubmit(e, idx) {
    e.preventDefault();
    if (!gameStarted) return;
    if (idx !== currentPlayer) return;

    const word = inputs[idx].trim().toLowerCase();
    if (!word) return updateMessage(idx, "Please enter a word.");
    if (word.length < 4)
      return updateMessage(idx, "Word must be at least 4 letters.");
    if (lastLetter && word[0] !== lastLetter)
      return updateMessage(
        idx,
        `Word must start with '${lastLetter.toUpperCase()}'.`
      );
    if (historySet.current.has(word))
      return updateMessage(idx, "That word was already used.");

    const validMeaning = await validateWordMeaning(word);
    if (!validMeaning) {
      return updateMessage(idx, "Not a valid English word.");
    }

    // Calculate points
    let delta = BASE_POINTS;
    if (timeLeft > 10) delta += timeLeft;
    else if (timeLeft > 5) delta += 0;
    else if (timeLeft > 0) delta = -1;

    if (word.length > 4) delta += word.length - 4;

    applyScoreForPlayer(idx, delta < 0 ? -delta : delta);

    updateMessage(
      idx,
      delta >= 0 ? `Accepted! +${delta} points.` : "Late! -1 point"
    );

    setHistory((h) => [
      ...h,
      { word, by: idx, points: delta, time: TOTAL_TIME - timeLeft },
    ]);
    historySet.current.add(word);
    setLastLetter(word[word.length - 1]);

    setTimeout(() => switchTurn(), 1200);
  }

  function handleTimeout() {
    updateMessage(currentPlayer, "Time's up! -2 points.");
    applyScoreForPlayer(currentPlayer, 2);
    setHistory((h) => [
      ...h,
      { word: "Pass", by: currentPlayer, points: -2, time: TOTAL_TIME },
    ]);
    setTimeout(() => switchTurn(), 1200);
  }

  function updateMessage(idx, msg) {
    setMessages((prev) => {
      const newMsgs = [...prev];
      newMsgs[idx] = msg;
      return newMsgs;
    });
  }

  return (
    <div className=" p-4">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-gray-800">Word Challenge</h1>
        <p className="text-gray-600 mt-2">
          Test your vocabulary under pressure!
        </p>
      </header>

      {!gameStarted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Play?
            </h2>
            <p className="text-gray-600 mb-6">
              Create words starting with the given letter before time runs out!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center bg-white p-4 rounded-xl shadow-md">
            <div className="text-sm text-gray-500 mb-1">Current Letter</div>
            <div className="text-4xl font-bold text-blue-600">
              {lastLetter.toUpperCase() || "-"}
            </div>
          </div>

          <div className="flex items-center bg-white p-4 rounded-xl shadow-md">
            <IoIosTimer className="text-3xl text-blue-500 mr-2" />
            <div className="text-center">
              <div className="text-sm text-gray-500">Time Remaining</div>
              <div
                className={`text-2xl font-bold ${
                  timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-800"
                }`}
              >
                {timeLeft}s
              </div>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Restart Game
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.map((player, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                currentPlayer === idx && gameStarted
                  ? "ring-4 ring-blue-400 transform -translate-y-1"
                  : "opacity-80"
              }`}
            >
              <div
                className={`flex items-center justify-between p-4 ${
                  currentPlayer === idx && gameStarted
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center">
                  <CgProfile className="text-2xl mr-2" />
                  <span className="font-semibold">{player.name}</span>
                </div>
                <div className="font-bold text-lg">{player.score} pts</div>
              </div>

              <div className="p-5">
                <form onSubmit={(e) => handleSubmit(e, idx)}>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputs[idx]}
                      onChange={(e) =>
                        setInputs((prev) => {
                          const arr = [...prev];
                          arr[idx] = e.target.value;
                          return arr;
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={
                        lastLetter
                          ? `Start with '${lastLetter.toUpperCase()}'`
                          : "Waiting for game to start..."
                      }
                      disabled={
                        loadingValidation ||
                        idx !== currentPlayer ||
                        !gameStarted
                      }
                    />
                    {loadingValidation && (
                      <div className="absolute right-3 top-3.5">
                        <div className="w-5 h-5 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      idx !== currentPlayer || !gameStarted || loadingValidation
                    }
                    className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all ${
                      idx === currentPlayer && gameStarted && !loadingValidation
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {loadingValidation ? "Validating..." : "Submit Word"}
                  </button>
                </form>

                {messages[idx] && (
                  <div
                    className={`mt-4 p-3 rounded-lg text-center ${
                      messages[idx].includes("Accepted")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {messages[idx]}
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b">
                    Word History
                  </h4>
                  <div className="max-h-48 overflow-auto space-y-2">
                    {history.filter((h) => h.by === idx).length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        No words yet
                      </div>
                    ) : (
                      history
                        .filter((h) => h.by === idx)
                        .map((h, i) => (
                          <div
                            className={`p-3 rounded-lg ${
                              h.points > 0 ? "bg-green-50" : "bg-red-50"
                            } border ${
                              h.points > 0
                                ? "border-green-200"
                                : "border-red-200"
                            }`}
                            key={i}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{h.word}</span>
                              <span
                                className={`font-bold ${
                                  h.points > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {h.points > 0 ? "+" : ""}
                                {h.points}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Time used: {h.time}s
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
