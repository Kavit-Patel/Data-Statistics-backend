📊 Data Statistics Backend
The Data Statistics Backend is a robust and scalable server-side application built to power the Data Statistics Dashboard frontend. It provides secure, efficient, and well-documented API endpoints for fetching, manipulating, and analyzing data. The backend is designed with scalability and performance in mind, using modern technologies and best practices.

🚀 Live Deployment
The backend is live and accessible at: [Data Statistics Backend](https://data-statistics-backend.onrender.com)

🛠️ Features
Comprehensive API: A suite of endpoints for data retrieval, data charting, filtering, and statistics.
Swagger Documentation: Interactive and auto-generated API documentation available at https://data-statistics-backend.onrender.com/docs.
Efficient Data Handling: Optimized for high-volume requests and smooth integration with the frontend.
Pagination Support: Enables efficient navigation of large datasets.
Environment Configuration: Supports configurable API base URLs and database connections for different environments.

⚙️ Technologies Used
Framework: nest.js
API Documentation: Swagger UI
Database: Postgresql
ORM: Prisma
📑 API Documentation
The backend is equipped with an interactive Swagger UI for API exploration and testing.

Access Swagger UI
Visit: https://data-statistics-backend.onrender.com/docs

Swagger allows you to:

View all available API endpoints.
Test APIs directly from the browser.
Understand the request/response formats and parameters.

🖥️ Local Development
Prerequisites
Node.js (>= 16.0.0)
npm or yarn
Postgresql (local or cloud)
Clone the Repository: git clone https://github.com/your-username/data-statistics-backend.git
cd data-statistics-backend
Install Dependencies: npm install
Environment Variables: DATABASE_URL="postgresql://****:*****@localhost:5432/mydb?schema=public"
                       PRODUCT_URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
                       ALLOWED_ORIGINS = http://localhost:3000/,http://localhost:3001/,http://localhost:5173/

Run the Development Server: npm run start:dev
The server will start on http://localhost:3001.

📋 Available Endpoints
Base URL: https://data-statistics-backend.onrender.com
Here are some of the key endpoints provided by the backend:

Method	Endpoint	Description
GET	/product/master-data	Fetch all products ,first 10 products.
GET	/product/master-data?page=2	Fetch paginated products.
GET	/product/statistics	Retrieve sales statistics.
GET	/product//barChart	Fetch bar chart data.
GET	/product/pieChart	Fetch pie chart data.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

🤝 Contribution
Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

Fork the repository.
Create your feature branch: git checkout -b feature/my-new-feature.
Commit your changes: git commit -m 'Add some feature'.
Push to the branch: git push origin feature/my-new-feature.
Submit a pull request.

🧑‍💻 Author
Kavit-Patel @kvpatel.er@gmail.com

GitHub: [Your GitHub Profile](https://github.com/Kavit-Patel/)
LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/kavitpatel2050)

📞 Support
For any questions or feedback, please feel free to open an issue or contact me directly via email at kvpatel.er@gmail.com.

