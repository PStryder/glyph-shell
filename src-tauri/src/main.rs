#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri_plugin_sql::{Database, Migration, MigrationKind};
use serde_json::Value;

// StoneCodex setup: Create tables if missing
async fn setup_stonecodex(db: Database) -> Result<(), String> {
  db.execute(
      "
      CREATE TABLE IF NOT EXISTS threads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
      );
      ",
      [],
  ).await.map_err(|e| e.to_string())?;

  db.execute(
      "
      CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          thread_id INTEGER NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE
      );
      ",
      [],
  ).await.map_err(|e| e.to_string())?;

  Ok(())
}

// ----- StoneCodex Command Handlers -----

#[tauri::command]
async fn stonecodex_add_thread(db: Database, thread: Value) -> Result<(), String> {
  let name = thread["name"].as_str().unwrap_or_default();
  let created_at = thread["created_at"].as_i64().unwrap_or(0);
  let updated_at = thread["updated_at"].as_i64().unwrap_or(0);

  db.execute(
      "INSERT INTO threads (name, created_at, updated_at) VALUES (?1, ?2, ?3)",
      [name.into(), created_at.into(), updated_at.into()],
  ).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn stonecodex_add_message(db: Database, message: Value) -> Result<(), String> {
  let thread_id = message["thread_id"].as_i64().unwrap_or(0);
  let role = message["role"].as_str().unwrap_or_default();
  let content = message["content"].as_str().unwrap_or_default();
  let timestamp = message["timestamp"].as_i64().unwrap_or(0);

  db.execute(
      "INSERT INTO messages (thread_id, role, content, timestamp) VALUES (?1, ?2, ?3, ?4)",
      [thread_id.into(), role.into(), content.into(), timestamp.into()],
  ).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn stonecodex_get_all_threads(db: Database) -> Result<Vec<Value>, String> {
  let rows = db.select(
      "SELECT id, name, created_at, updated_at FROM threads ORDER BY created_at DESC",
      [],
  ).await.map_err(|e| e.to_string())?;

  Ok(rows)
}

#[tauri::command]
async fn stonecodex_get_thread(db: Database, id: i64) -> Result<Value, String> {
  let thread_row = db.select(
      "SELECT id, name, created_at, updated_at FROM threads WHERE id = ?1",
      [id.into()],
  ).await.map_err(|e| e.to_string())?;

  let messages = db.select(
      "SELECT id, role, content, timestamp FROM messages WHERE thread_id = ?1 ORDER BY timestamp ASC",
      [id.into()],
  ).await.map_err(|e| e.to_string())?;

  Ok(serde_json::json!({
      "thread": thread_row,
      "messages": messages
  }))
}

#[tauri::command]
async fn stonecodex_delete_thread(db: Database, id: i64) -> Result<(), String> {
  db.execute(
      "DELETE FROM threads WHERE id = ?1",
      [id.into()],
  ).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn stonecodex_save_imported_thread(db: Database, thread: Value) -> Result<(), String> {
  let name = thread["name"].as_str().unwrap_or_default();
  let created_at = thread["created_at"].as_i64().unwrap_or(0);
  let updated_at = thread["updated_at"].as_i64().unwrap_or(0);

  db.execute(
      "INSERT INTO threads (name, created_at, updated_at) VALUES (?1, ?2, ?3)",
      [name.into(), created_at.into(), updated_at.into()],
  ).await.map_err(|e| e.to_string())?;

  let thread_id = db.last_insert_rowid()
      .await
      .map_err(|e| e.to_string())?;

  if let Some(messages) = thread["messages"].as_array() {
      for msg in messages {
          let role = msg["role"].as_str().unwrap_or_default();
          let content = msg["content"].as_str().unwrap_or_default();
          let timestamp = msg["timestamp"].as_i64().unwrap_or(0);

          db.execute(
              "INSERT INTO messages (thread_id, role, content, timestamp) VALUES (?1, ?2, ?3, ?4)",
              [thread_id.into(), role.into(), content.into(), timestamp.into()],
          ).await.map_err(|e| e.to_string())?;
      }
  }

  Ok(())
}

// ----- Main App Setup -----

fn main() {
  tauri::Builder::default()
      .plugin(tauri_plugin_sql::Builder::default().build())
      .setup(|app| {
          let handle = app.handle();
          tauri::async_runtime::spawn(async move {
              if let Some(db) = handle.state::<Database>().inner().get("sqlite:codex.db").await.ok() {
                  let _ = setup_stonecodex(db).await;
              }
          });
          Ok(())
      })
      .invoke_handler(tauri::generate_handler![
          stonecodex_add_thread,
          stonecodex_add_message,
          stonecodex_get_all_threads,
          stonecodex_get_thread,
          stonecodex_delete_thread,
          stonecodex_save_imported_thread,
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
