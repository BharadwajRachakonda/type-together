"use server";
import { data } from "motion/react-client";
import postgres from "postgres";
import type { Row, RowList } from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// export async function create_table() {
//   try {
//     await sql`
//       CREATE TABLE IF NOT EXISTS typing_records (
//         id SERIAL PRIMARY KEY,
//         email TEXT NOT NULL,
//         speed INTEGER NOT NULL,
//         accuracy INTEGER NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `;
//   } catch (error) {
//     console.error("Failed to create table:", error);
//     throw new Error("Failed to create table.");
//   }
// }

export async function createData(data: RowList<Row[]>) {
  const Data = {
    labels: [] as string[],
    datasets: [
      {
        label: "Speed",
        data: [] as number[],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132, 0.2)",
        borderWidth: 1,

        borderRadius: 10,
        fill: true,
      },
      {
        label: "Accuracy",
        data: [] as number[],
        borderColor: "rgb(56, 190, 202)",
        borderWidth: 1,
        backgroundColor: "rgb(56, 190, 202, 0.2)",
        borderRadius: 10,
        fill: true,
      },
    ],
  };
  data.forEach((record) => {
    Data.labels.push(
      record.created_at.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    Data.datasets[0].data.push(record.speed);
    Data.datasets[1].data.push(record.accuracy);
  });
  Data.datasets[0].data.reverse();
  Data.datasets[1].data.reverse();
  Data.labels.reverse();
  return Data;
}

export async function addRecord(
  email: string,
  speed: number,
  accuracy: number
) {
  await sql`INSERT INTO typing_records (email, speed, accuracy) VALUES (${email}, ${speed}, ${accuracy})`;
}

export async function get10Records(email: string) {
  try {
    const records = await sql`
      SELECT id, created_at, speed, accuracy FROM typing_records WHERE email = ${email} ORDER BY created_at DESC LIMIT 10
    `;
    return records;
  } catch (error) {
    console.error("Failed to fetch records:", error);
    throw new Error("Failed to fetch records.");
  }
}

export async function getTop10UsersAndCurrentRank(email: string) {
  try {
    const topUsers = await sql`
      SELECT email, MAX(speed) AS avg_speed, MAX(accuracy) AS avg_accuracy
      FROM typing_records
      GROUP BY email
      ORDER BY avg_speed DESC, avg_accuracy DESC
      LIMIT 10
    `;

    const currentUserEmail = email;
    if (!currentUserEmail) {
      throw new Error("Current user email is not set.");
    }

    const currentUserRank = await sql`
      SELECT rank() OVER (ORDER BY MAX(speed) DESC, MAX(accuracy) DESC) AS rank
      FROM typing_records
      WHERE email = ${currentUserEmail}
    `;

    return {
      topUsers,
      currentUserRank:
        currentUserRank.length > 0 ? currentUserRank[0].rank : null,
    };
  } catch (error) {
    console.error("Failed to fetch top users:", error);
    throw new Error("Failed to fetch top users.");
  }
}
