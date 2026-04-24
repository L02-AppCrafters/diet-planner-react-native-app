# Diet Planner React Native App

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=L02-AppCrafters_diet-planner-react-native-app&metric=coverage)](https://sonarcloud.io/summary/new_code?id=L02-AppCrafters_diet-planner-react-native-app)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=L02-AppCrafters_diet-planner-react-native-app&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=L02-AppCrafters_diet-planner-react-native-app)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=L02-AppCrafters_diet-planner-react-native-app&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=L02-AppCrafters_diet-planner-react-native-app)
[![Test and SonarCloud](https://github.com/L02-AppCrafters/diet-planner-react-native-app/actions/workflows/test.yml/badge.svg?branch=dev)](https://github.com/L02-AppCrafters/diet-planner-react-native-app/actions/workflows/test.yml)

Mobile application hỗ trợ xây dựng thực đơn và kế hoạch ăn uống cá nhân hóa, phát triển bằng Expo + React Native.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router (file-based routing)
- Convex + Firebase
- Jest + Testing Library React Native
- SonarCloud + GitHub Actions CI

## Project Structure

- app: màn hình và router chính
- components: các UI component tái sử dụng
- context: global context (UserContext)
- services: Firebase, AI services
- shared: constants, prompts, colors
- __tests__: unit tests

## Prerequisites

- Node.js 20+
- npm
- Expo CLI thông qua npx expo

## How to run locally

1. Cài dependencies

   npm install

2. Chạy ứng dụng

   npx expo start

3. Tùy chọn target

   npm run android
   npm run ios
   npm run web

## How to run tests locally

1. Cài dependencies

   npm install

2. Chạy test kèm coverage

   npm test -- --coverage

Sau khi chạy xong, báo cáo coverage HTML nằm ở thư mục coverage/lcov-report/index.html.

## CI/CD and Quality Gate

Workflow CI tại .github/workflows/test.yml sẽ tự động:

1. Checkout source code
2. Setup Node.js
3. Install dependencies
4. Run unit tests và generate coverage
5. Upload artifact test-report từ coverage/lcov-report
6. Scan chất lượng mã nguồn lên SonarCloud

## SonarCloud Configuration

File sonar-project.properties đang cấu hình:

- project key: L02-AppCrafters_diet-planner-react-native-app
- organization: l02-appcrafters
- coverage report path: coverage/lcov.info

## Notes

- Nếu bạn muốn badge đúng 100% theo giao diện SonarCloud, vào SonarCloud -> Project Information -> chọn từng badge và thay link markdown ở đầu file này.
- Nếu đổi tên workflow hoặc branch mặc định, cập nhật lại link badge GitHub Actions tương ứng.
