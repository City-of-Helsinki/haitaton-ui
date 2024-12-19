
const today: Date = new Date();
const todayFull: string = today.toISOString();
const todayDate: number = today.getDate()

const tomorrow: Date = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const currentMonth: string = today.toLocaleString('fi-FI', { month: "long" });

interface TestUser {
  username: string;
  email: string;
  phonenumber: string;
  y_tunnus: string
};

interface HaitatonTestData {
  testEnvUrl: string,
  runtime: string,
  today: Date,
  todayFull: string,
  todayDate: number,
  tomorrow: Date,
  currentMonth: string,
  allu_url: string
};

interface Testiosoite {
  address: string
};

export const perustaja: TestUser = {
  username: process.env.asiakas_username ?? "",
  email: process.env.asiakas_email ?? "",
  phonenumber: process.env.asiakas_phonenumber ?? "",
  y_tunnus: process.env.asiakas_y_tunnus ?? ""
};

export const vastaava: TestUser = {
  username: process.env.vastaava_username ?? "",
  email: process.env.vastaava_email ?? "",
  phonenumber: process.env.vastaava_phonenumber ?? "",
  y_tunnus: process.env.vastaava_y_tunnus ?? ""
};
export const suorittaja: TestUser = {
  username: process.env.suorittaja_username ?? "",
  email: process.env.suorittaja_email ?? "",
  phonenumber: process.env.suorittaja_phonenumber ?? "",
  y_tunnus: process.env.suorittaja_y_tunnus ?? ""
};
export const rakennuttaja: TestUser = {
  username: process.env.rakennuttaja_username ?? "",
  email: process.env.rakennuttaja_email ?? "",
  phonenumber: process.env.rakennuttaja_phonenumber ?? "",
  y_tunnus: process.env.rakennuttaja_y_tunnus ?? ""
};
export const asianhoitaja: TestUser = {
  username: process.env.asianhoitaja_username ?? "",
  email: process.env.asianhoitaja_email ?? "",
  phonenumber: process.env.asianhoitaja_phonenumber ?? "",
  y_tunnus: process.env.asianhoitaja_y_tunnus ?? ""
};

export const testiData: HaitatonTestData = {
  testEnvUrl: process.env.haitaton_testing ?? "",
  runtime: todayFull,
  today: today,
  todayFull: todayFull,
  todayDate: todayDate,
  tomorrow: tomorrow,
  currentMonth: currentMonth,
  allu_url: process.env.allu_testing ?? ""
};

export const testiOsoite: Testiosoite = {
  address: process.env.asiakas_os1 ?? ""
};
