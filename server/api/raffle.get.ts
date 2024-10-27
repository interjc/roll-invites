// server/api/raffle.get.ts
import { defineEventHandler } from "h3";
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  try {
    // 从环境变量获取盐值和初始中奖概率
    const salt = process.env.RANDOM_SALT || 'default_salt';
    const initialWinningProbability = parseFloat(process.env.WINNING_PROBABILITY || '0.001');

    // 获取发布时间和当前时间
    const secretInfo = process.env.SECRET_INFO || '';
    const releaseTime = new Date(secretInfo);
    const currentTime = new Date();

    // 计算经过的小时数
    const hoursPassed = Math.floor((currentTime.getTime() - releaseTime.getTime()) / (1000 * 60 * 60));

    // 计算当前中奖概率，每小时递增
    let currentWinningProbability = Math.min(initialWinningProbability + (hoursPassed * 0.01), 1);

    // 生成唯一的抽奖ID
    const raffleId = crypto.randomUUID();

    // 使用时间戳、盐值和抽奖ID生成随机数
    const randomValue = Math.random();

    // 判断是否中奖
    const isWinner = randomValue < currentWinningProbability;

    // 从环境变量获取奖品码和相关信息
    const secretCode = process.env.SECRET_CODE || null;

    // 判断是否售罄
    const soldout =
      secretCode === null || secretCode === "" || secretCode === "0";

    return {
      raffleId,
      success: isWinner,
      message: isWinner ? "恭喜中奖！" : "未中奖",
      code: isWinner ? secretCode : null,
      info: secretInfo,
      randomValue: process.env.NODE_ENV === 'development' ? randomValue : null,
      winningProbability: currentWinningProbability, // 返回当前中奖概率
      soldout,
      time: new Date().toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    };
  } catch (error: unknown) {
    event.node.res.statusCode = 500;
    return {
      success: false,
      message: "系统错误",
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    };
  }
});
