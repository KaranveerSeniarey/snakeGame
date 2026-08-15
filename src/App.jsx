import { useRef, useState, useEffect } from "react";

function Box({ className = "", content }) {
  return <div className={`${className} w-7 h-7 text-2xl`}>{content}</div>;
}

function Btn({ name, className = "", fnc = "" }) {
  return (
    <button
      className={`text-white shadow-[5px_5px_10px_rgba(0,0,0,0.500)] ${className} font-bold text-2xl text-center `}
      onClick={() => fnc(event, name)}
    >
      {name}
    </button>
  );
}

function Board({ snake, food, handleKeyDown, gameReady }) {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  // useEffect(() => {
  //   if (food === snake) {
  //     snake.push(prevPos);
  //     setScore((prev) => prev + 1);
  //     setFood(Math.floor(Math.random() * 100) + 1);
  //     console.log("Score up");
  //   }
  // }, [snake]);

  let btns = [];
  let num = 1;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      btns.push(
        <Box
          key={num}
          className={`${snake.indexOf(num) != -1 && gameReady ? "bg-green-300" : ""}`}
          content={`${num === food && gameReady ? "🍎" : ""}`}
        />,
      );
      num++;
    }
  }

  return (
    <>
      <div className="flex items-center flex-col gap-2">

        <div className="grid grid-cols-10 grid-rows-10 text-center border-4 border-mauve-400 rounded-xl p-2 relative">

          <img src="../src/assets/Snake.png" className="absolute h-50 top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] transition-all duration-500" style={!gameReady ? { transform: "scale(1)" } : { transform: "scale(0)" }} />

          {btns}

        </div>

        <div className="lg:hidden grid grid-cols-3 grid-rows-2 gap-2 border-4 border-mauve-400 rounded-xl p-2 ">
          <Btn
            name="⬆️"
            className="col-span-3 place-self-center"
            fnc={handleKeyDown}
          />
          <Btn name="⬅️" fnc={handleKeyDown} className={"rounded-sm"} />
          <Btn name="⬇️" fnc={handleKeyDown} className={"rounded-sm"} />
          <Btn name="➡️" fnc={handleKeyDown} className={"rounded-sm"} />
        </div>
      </div>
    </>
  );
}

function Game() {
  const [snake, setSnake] = useState([1]);
  const snakeRef = useRef([1]);
  const [food, setFood] = useState(5);
  const foodRef = useRef(5);
  const [score, setScore] = useState(0);
  const gameStart = useRef(false);
  const [gameReady, setgameReady] = useState(false);
  const dirRef = useRef("r");
  const timerRef = useRef(null);

  useEffect(() => {
    if (snake[0] == food) {
      setScore((prev) => prev + 1);
      let tm = Math.floor(Math.random() * 100) + 1;
      while (snake.indexOf(tm) != -1) {
        tm = Math.floor(Math.random() * 100) + 1;
      }
      foodRef.current = tm;
      setFood(tm);
    }
  });

  useEffect(() => {
    let tm = Math.floor(Math.random() * 100) + 1;
    while (snake.indexOf(tm) != -1) {
      tm = Math.floor(Math.random() * 100) + 1;
    }
    foodRef.current = tm;
    setFood(tm);
    setSnake([1]);
    snakeRef.current = [1];
    dirRef.current = "r";
    setScore(0);
  }, [gameReady])


  // function updateSnake(foodFlag, tmSnake) {
  //   if (foodFlag) {
  //     const newSnake = [tmSnake, ...snake.slice()];
  //     setSnake(newSnake);
  //   } else {
  //     const newSnake = [tmSnake, ...snake.slice(0, snake.length - 1)];
  //     setSnake(newSnake);
  //   }
  //   snakeHead.current = tmSnake;
  // }
  
  function updateSnake(foodFlag, tmSnake) {
    if (snakeRef.current.indexOf(tmSnake) != -1) {
      clearInterval(timerRef.current);
      gameStart.current = false;
      setgameReady(false);
      console.log("END");
      return;
    }
    let newSnake;
    if (foodFlag) {
      newSnake = [tmSnake, ...snakeRef.current.slice()];
      setSnake(newSnake);
    } else {
      newSnake = [
        tmSnake,
        ...snakeRef.current.slice(0, snakeRef.current.length - 1),
      ];
      setSnake(newSnake);
    }
    snakeRef.current = newSnake;
  }

  function moveSnake() {
    timerRef.current = setInterval(() => {
      if (dirRef.current == "r") {
        if (snakeRef.current[0] % 10 === 0) {
          clearInterval(timerRef.current);
          gameStart.current = false;
          setgameReady(false);
          return;
        } else if (snakeRef.current[0] + 1 === foodRef.current) {
          updateSnake(true, snakeRef.current[0] + 1);
        } else {
          updateSnake(false, snakeRef.current[0] + 1);
        }
      } else if (dirRef.current == "l") {
        if (snakeRef.current[0] % 10 === 1) {
          clearInterval(timerRef.current);
          gameStart.current = false;
          setgameReady(false);
          return;
        } else if (snakeRef.current[0] - 1 === foodRef.current) {
          updateSnake(true, snakeRef.current[0] - 1);
        } else {
          updateSnake(false, snakeRef.current[0] - 1);
        }
      } else if (dirRef.current == "u") {
        if (snakeRef.current[0] <= 10) {
          clearInterval(timerRef.current);
          gameStart.current = false;
          setgameReady(false);
          return;
        } else if (snakeRef.current[0] - 10 === foodRef.current) {
          updateSnake(true, snakeRef.current[0] - 10);
        } else {
          updateSnake(false, snakeRef.current[0] - 10);
        }
      } else if (dirRef.current == "d") {
        if (snakeRef.current[0] >= 91) {
          clearInterval(timerRef.current);
          gameStart.current = false;
          setgameReady(false);
          return;
        } else if (snakeRef.current[0] + 10 === foodRef.current) {
          updateSnake(true, snakeRef.current[0] + 10);
        } else {
          updateSnake(false, snakeRef.current[0] + 10);
        }
      }
    }, 800);
  }

  function handleKeyDown(event, dir = null) {
    // let tmSnake;
    // console.log(dir);

    if (event.key === "w" || event.key === "ArrowUp" || dir === "⬆️") {
      // console.log("UP");
      // tmSnake = snake[0] - 10;
      // if (tmSnake == food) {
      //   updateSnake(true, tmSnake);
      // } else {
      //   updateSnake(false, tmSnake);
      // }
      dirRef.current = "u";
    }

    if (event.key === "s" || event.key === "ArrowDown" || dir === "⬇️") {
      // console.log("DOWN");
      // tmSnake = snake[0] + 10;
      // if (tmSnake == food) {
      //   updateSnake(true, tmSnake);
      // } else {
      //   updateSnake(false, tmSnake);
      // }
      dirRef.current = "d";
    }

    if (event.key === "a" || event.key === "ArrowLeft" || dir === "⬅️") {
      // console.log("LEFT");
      // tmSnake = snake[0] - 1;
      // if (tmSnake == food) {
      //   updateSnake(true, tmSnake);
      // } else {
      //   updateSnake(false, tmSnake);
      // }
      dirRef.current = "l";
    }

    if (event.key === "d" || event.key === "ArrowRight" || dir === "➡️") {
      // setSnake(snake + 1);
      // tmSnake = snake[0] + 1;
      // if (tmSnake == food) {
      //   updateSnake(true, tmSnake);
      // } else {
      //   updateSnake(false, tmSnake);
      // }
      dirRef.current = "r";
    }
  }

  function startGame() {
    if (gameStart.current) {
      return;
    }
    console.log("START GAME");
    gameStart.current = true;
    setgameReady(true);
    moveSnake();
  }

  return (
    <>
      <h1
        className="text-center text-4xl font-bold"
        style={{ fontFamily: "cursive" }}
      >
        Snake Game
      </h1>
      <div className="flex justify-center">
        <h1 className="text-center border-2 rounded-2xl px-2 border-blue-700 my-2 ">
          Score: {score}
        </h1>
      </div>
      <Board snake={snake} food={food} handleKeyDown={handleKeyDown} gameReady={gameReady} />
      <div className="flex justify-center my-2">
        <Btn
          name={"Start"}
          className={
            `bg-indigo-500 rounded-full px-2 transition-all duration-500 ${!gameReady ? "scale-100" : "scale-0"} `
          }
          fnc={startGame}
        />
      </div>
    </>
  );
}

export default Game;
