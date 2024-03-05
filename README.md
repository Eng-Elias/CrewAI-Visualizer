# CrewAI Simplified App

This application provides a simplified user interface for leveraging the power of CrewAI, a cutting-edge framework for orchestrating role-playing autonomous AI agents. With this app, users can streamline the process of creating and managing AI crews without the need for coding.

[![CrewAI Visualizer](https://img.youtube.com/vi/ZVZucnzccpk/0.jpg)](https://www.youtube.com/watch?v=ZVZucnzccpk)

## Features

- **Intuitive UI**: The app offers a user-friendly interface, allowing users to easily create and manage AI crews.
- **Role-Based Agent Design**: Customize agents with specific roles, goals, and tools through a simple form-based approach.
- **Task Management**: Define tasks and assign them to agents dynamically.
- **Sequential and Hierarchical Processes**: Choose between sequential or hierarchical processes for task execution, depending on your workflow needs.
- **Save Output**: Save the output for future reference or analysis.
- **Connection to LLM model**: for this version I used Gemini model and I plan to add more models in the future.

## Getting Started

To get started with the CrewAI Simplified App, follow these simple steps:

1. **Installation**: Clone the repository and install dependencies using npm or yarn:

   ```bash
   git clone https://github.com/Eng-Elias/CrewAI-Visualizer.git
   cd CrewAI-Visualizer
   npm install
   ```

2. **Create Python Virtual Enviroment**: create Python venv, activate the venv and install the requirements.

   Create venv:

   ```bash
   python -m venv venv
   ```

   To activate the virtual environment on Windows:

   ```bash
   .\venv\Scripts\activate
   ```

   To activate the virtual environment on Linux or Mac:

   ```bash
   source venv/bin/activate
   ```

   Install the requirements:

   ```bash
   pip install -r requirements.txt
   ```

3. **Configuration**: Set up your environment variables in a `.env` file:

   Just rename .env.template to .env and set your values:

   ```plaintext
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/         crew_ai_visualizer?schema=public"

   GEMINI_API_KEY=""

   PYTHON_SITE_PACKAGES="<The  path of site packages folder in the venv you created in the previous step>"

   CREW_AI_PY_FILE="<the path of my crew_ai.py file in on your system. you can find it in src/app/api/graphql/crew_ai.py>"
   ```

4. **Start the Development Server**: Run the following command to start the development server:

   ```bash
   npm run dev
   ```

5. **Access the App**: Once the development server is running, access the app in your browser at `http://localhost:3000`.

## Usage

1. **Create a New Crew**: By adding agents.

2. **Customize Agents**: Fill in the information for each agent, including role, goal, backstory, tools, allow_deligation, and verbose.

3. **Define Missions**: Fill mission information including name, crew, verbose, process and add tasks with their details (name, description, agent).

4. **Execute Mission**: Once your mission is set up, execute it to start the execution process.

5. **View Results**: View the output of completed missions within the app.

## Contributing

We welcome contributions to the CrewAI Simplified App. If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or improvement.
3. Add your feature or improvement.
4. Submit a pull request.

## Tech Stack

This app is built using TypeScript, Prisma, GraphQL, Next.js, and node-calls-python to execute Python code from Node.js and get the result in addition to use Gemini as LLM.

## License

This application is open-source and is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## To Do

- [ ] Add more tools for agents either from LangChain community or create new useful tools.
- [ ] Add more LLM options like ChatGPT and local LLMs.

## Credits

Special thanks to [João Moura](https://github.com/joaomdmoura) the creator of [CrewAI](https://github.com/joaomdmoura/crewAI) for providing the underlying framework for AI crew orchestration.
