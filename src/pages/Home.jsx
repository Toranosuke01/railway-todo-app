import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Header } from "../components/Header";
import { url } from "../const";
import "../css/home.css";
import { formatToReadableDateTime } from "../utils/dateUtils";

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState("todo"); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies] = useCookies();
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== "undefined") {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleKeyDown = (event, index) => {
    // 右矢印キーが押された場合
    if (event.key === "ArrowRight") {
      event.preventDefault(); // スクロールを防ぐ
      const nextIndex = (index + 1) % lists.length;
      handleSelectList(lists[nextIndex].id);
      // フォーカスを新しいタブに移動
      document.getElementById(`list-item-${lists[nextIndex].id}`).focus();
    }
    // 左矢印キーが押された場合
    else if (event.key === "ArrowLeft") {
      event.preventDefault(); // スクロールを防ぐ
      const prevIndex = index > 0 ? index - 1 : lists.length - 1;
      handleSelectList(lists[prevIndex].id);
      // フォーカスを新しいタブに移動
      document.getElementById(`list-item-${lists[prevIndex].id}`).focus();
    }
  };

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };
  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new">リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link>
              </p>
            </div>
          </div>
          <ul className="list-tab" role="tablist">
            {lists.map((list, index) => {
              const isActive = list.id === selectListId;
              return (
                <li
                  id={`list-item-${list.id}`}
                  key={list.id}
                  className={`list-tab-item ${isActive ? "active" : ""}`}
                  role="tab"
                  tabIndex="0"
                  aria-selected={list.id === selectListId}
                  onClick={() => handleSelectList(list.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  {list.title}
                </li>
              );
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new">タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select onChange={handleIsDoneDisplayChange} className="display-select">
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />
          </div>
        </div>
      </main>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  if (isDoneDisplay == "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
                {task.title}
                <br />
                期限：{formatToReadableDateTime(task.limit)}
                <br />
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <li key={key} className="task-item">
            <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
              {task.title}
              <br />
              <div>期限：{formatToReadableDateTime(task.limit)}</div>
              <RemainingTime limit={new Date(task.limit)} />
              <br />
              {task.done ? "完了" : "未完了"}
            </Link>
          </li>
        ))}
    </ul>
  );
};

const RemainingTime = ({ limit }) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    // 残り時間を計算する関数
    const calculateRemainingTime = () => {
      const now = new Date();
      const difference = limit.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        return `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
      } else {
        return "期限切れです";
      }
    };

    const intervalId = setInterval(() => {
      const timeString = calculateRemainingTime();
      setRemainingTime(timeString);
    }, 1000);

    // コンポーネントのクリーンアップ時にインターバルをクリア
    return () => clearInterval(intervalId);
  }, [limit]);

  return <div>残り時間: {remainingTime}</div>;
};
