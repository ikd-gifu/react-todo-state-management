// 単一責任	Template = ロジック・状態管理、Organisms = レイアウト、Atoms: 純粋なUI部品
// Container/Presentational パターンとも呼ばれる
import { useState } from "react";
import styles from "./style.module.css";
import { AddTodo, TodoList } from "../../organisms/";
import { INITIAL_TODOS, INITIAL_UNIQUE_ID } from "../../../constants/data";

// 全ての状態を管理
// originTodoListは複数のコンポーネントで使われる
// → 親（TodoTemplate）で管理する
export const TodoTemplate = () => {
  // todo listの状態管理
  // const [現在の値, 値を更新するための関数] = useState(初期値);
  const [originalTodoList, setOriginalTodoList] = useState(INITIAL_TODOS );
  // 追加用の入力値の状態管理 初期値を空文字に設定
  const [addInputValue, setAddInputValue] = useState("");
  // 重複しない ID を生成
  // const [uniqueId, setUniqueId] = useState(INITIAL_TODOS.length + 1); データはdata.jsで一元管理
  const [uniqueId, setUniqueId] = useState(INITIAL_UNIQUE_ID);

    /**
   * addInputValueの変更処理 ユーザーの入力を受け取る
   * @param {Event} e
   */
  const onChangeAddInputValue = (e) => setAddInputValue(e.target.value);

  /**
 * Todo新規登録処理
 * @param {KeyboardEvent} e - キーボードイベント
 */

  const handleAddTodo = (e) => {
    // IME変換中は処理しない
    if (e.key === "Enter" && !e.nativeEvent.isComposing && addInputValue !== "") {
      const nextId = uniqueId + 1;

      // 新しいTodoを作成
      // 元の配列をコピーして、その値でstateを更新する
      // 配列要素を追加しても配列の参照は変わらないため、Reactが変更を検知できない
      const newTodoList = [
        ...originalTodoList,
        {
          id: nextId,
          title: addInputValue,
        },
      ];
      // 状態を更新
      setOriginalTodoList(newTodoList);

      // nextIdを更新
      setUniqueId(nextId);
      // 入力フォームを空にする
      setAddInputValue("");
    }
  };

  // Todo削除処理 @param は /**  */ のJSDocコメント内で使う
  /**
  * @param {number} targetId - 削除対象のTodoのID
  * @param {string} targetTitle - 削除対象のTodoのタイトル
  */
  const handleDeleteTodo = (targetId, targetTitle) => {
    // 確認ダイアログを表示
    if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
      // 削除対象のID以外のTodoだけを残す
      const newTodoList = originalTodoList.filter((todo) => todo.id !== targetId);
      
      // 状態を更新
      setOriginalTodoList(newTodoList);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo アプリ</h1>
      {/* Todo追加エリア */}
      <section className={styles.common}>
        <AddTodo
          addInputValue={addInputValue}
          onChangeTodo={onChangeAddInputValue}
          handleAddTodo={handleAddTodo}
          // Props名={実際の変数名}
        />
      </section>
      {/* Todo検索フォームエリア */}
      {/* Todoリスト一覧表示 */}
      <section className={styles.common}>
        {/* 状態、関数を渡す */}
        <TodoList
          todoList={originalTodoList}
          handleDeleteTodo={handleDeleteTodo}
        />
      </section>
    </div>
  );
};
