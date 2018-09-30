'use strict';

// Electronのモジュール
const electron = require("electron");
const appExpress = require("./app");

// アプリケーションをコントロールするモジュール
const app = electron.app;

// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
 if (process.platform != 'darwin') {
 app.quit();
 }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
 // メイン画面の表示。ウィンドウの幅、高さを指定できる
 mainWindow = new BrowserWindow({width: 1000, height: 600});
 mainWindow.loadURL('http://127.0.0.1:3000');

// ウィンドウが閉じられたらアプリも終了
 mainWindow.on('closed', function() {
 mainWindow = null;
 });
});