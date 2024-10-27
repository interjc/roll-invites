// server/api/raffle.get.ts
import { defineEventHandler } from "h3";
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// Mersenne Twister 实现
class MersenneTwister {
  private MT: number[];
  private index: number;

  constructor(seed: number) {
    this.MT = new Array(624).fill(0);
    this.index = 0;
    this.MT[0] = seed;
    for (let i = 1; i < 624; i++) {
      this.MT[i] = (0x6c078965 * (this.MT[i-1] ^ (this.MT[i-1] >>> 30)) + i) & 0xffffffff;
    }
  }

  private extract_number(): number {
    if (this.index === 0) {
      this.generate_numbers();
    }

    let y = this.MT[this.index];
    y = y ^ (y >>> 11);
    y = y ^ ((y << 7) & 0x9d2c5680);
    y = y ^ ((y << 15) & 0xefc60000);
    y = y ^ (y >>> 18);

    this.index = (this.index + 1) % 624;
    return y / 0xffffffff;
  }

  private generate_numbers(): void {
    for (let i = 0; i < 624; i++) {
      const y = (this.MT[i] & 0x80000000) + (this.MT[(i+1) % 624] & 0x7fffffff);
      this.MT[i] = this.MT[(i + 397) % 624] ^ (y >>> 1);
      if (y % 2 !== 0) {
        this.MT[i] = this.MT[i] ^ 0x9908b0df;
      }
    }
  }

  public random(): number {
    return this.extract_number();
  }
}

export default defineEventHandler(async (event) => {
  try {
    // 从环境变量获取盐值和中奖概率
    const salt = process.env.RANDOM_SALT || 'default_salt';
    const winningProbability = parseFloat(process.env.WINNING_PROBABILITY || '0.001');

    // 生成唯一的抽奖ID
    const raffleId = crypto.randomUUID();

    // 使用时间戳、盐值和抽奖ID生成种子
    const seed = parseInt(CryptoJS.SHA256(Date.now() + salt + raffleId).toString(), 16);

    // 初始化 Mersenne Twister
    const mt = new MersenneTwister(seed);

    // 生成随机数（确保是正数）
    const randomValue = Math.abs(mt.random());

    // 判断是否中奖
    const isWinner = randomValue < winningProbability;

    // 从环境变量获取奖品码和相关信息
    const secretCode = process.env.SECRET_CODE || null;
    const secretInfo = process.env.SECRET_INFO || null;

    // 判断是否售罄
    const soldout = secretCode === null || secretCode === '';

    return {
      raffleId,
      success: isWinner,
      message: isWinner ? "恭喜中奖！" : "未中奖",
      code: isWinner ? secretCode : null,
      info: isWinner ? secretInfo : null,
      randomValue: process.env.NODE_ENV === 'development' ? randomValue : null,
      winningProbability, // 在生产环境中建议移除
      soldout, // 新增的返回值
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
