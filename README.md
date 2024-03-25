# CrewAI Simplified App

This application provides a simplified user interface for leveraging the power of CrewAI, a cutting-edge framework for orchestrating role-playing autonomous AI agents. With this app, users can streamline the process of creating and managing AI crews without the need for coding.

<h3>V0.1</h3>

[![CrewAI Visualizer](https://img.youtube.com/vi/ZVZucnzccpk/0.jpg)](https://www.youtube.com/watch?v=ZVZucnzccpk)

<h3>V0.2</h3>

[![CrewAI Visualizer](https://img.youtube.com/vi/IpGmL_EM_bY/0.jpg)](https://www.youtube.com/watch?v=IpGmL_EM_bY)

## Features

- **Intuitive UI**: The app offers a user-friendly interface, allowing users to easily create and manage AI crews.
- **Role-Based Agent Design**: Customize agents with specific roles, goals, and tools through a simple form-based approach.
- **Task Management**: Define tasks and assign them to agents dynamically.
- **Sequential and Hierarchical Processes**: Choose between sequential or hierarchical processes for task execution, depending on your workflow needs.
- **Save Output**: Save the output for future reference or analysis.
- **Connection to LLM model**: for this version I used Gemini model and I plan to add more models in the future.

## Getting Started

To get started with the CrewAI Simplified App, install [PostgreSQL](https://www.postgresql.org/download/), setup PostgreSQL user and password and follow these simple steps:

For non-developers:

1. **Setup the project**: clone or download the project then run `setup_win.bat` for Windows users or `setup_linux_mac.sh` for Linux or MacOS users.

2. **Start the project**: run `start_win.bat` for Windows users or `start_linux_mac.sh` for Linux or MacOS users. ✔Finish!

For developers:

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
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/crew_ai_visualizer?schema=public"

   GEMINI_API_KEY=""

   PYTHON_SITE_PACKAGES="<The  path of site packages folder in the venv you created in the previous step>"

   CREW_AI_PY_FILE="<the path of my crew_ai.py file in on your system. you can find it in src/app/api/graphql/crew_ai.py>"
   ```

4. **DB Migrations**: Run the following commands to apply database migrations:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Start the Development Server**: Run the following command to start the development server:

   ```bash
   npm run dev
   ```

6. **Access the App**: Once the development server is running, access the app in your browser at `http://localhost:3000`.

## Usage

1. **Create a New Crew**: By adding agents.

2. **Customize Agents**: Fill in the information for each agent, including role, goal, backstory, tools, allow_deligation, verbose and memory.

3. **Define Missions**: Fill mission information including name, crew, verbose, process and add tasks with their details (name, description, agent, expected_output).

4. **Execute Mission**: Once your mission is set up, run it to start the execution process.

5. **View Results**: View the output of completed missions within the app.

## Contributing

We welcome contributions to the CrewAI Simplified App. If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or improvement.
3. Add your feature or improvement.
4. Submit a pull request.

## Tech Stack

This app is built using TypeScript, Prisma, GraphQL, Next.js, and node-calls-python to execute Python code from Node.js and get the result in addition to use Gemini as LLM.

## Updates

### Version 0.1

- Initial version.

### Version 0.2

- Features:
  - Update crewai package and add more fields to agents and tasks.
  - Add more tools:
    - ARXIV to search in scientific articles of many domains.
    - PubMed to answer questions about medicine, health, and biomedical topic.
- Improvement:
  - Update python and npm packages.
  - Some UI enhancements.
  - Add .bat and .sh files to setup and start the project easily for normal users.
  - Enhance README.md.

## To Do

- [ ] Build simpler version to simplify installing and using CrewAI Visualizer by normal users.
- [ ] Integrate [crewai[tools]](https://docs.crewai.com/core-concepts/Tools/) by adding tools settings to allow configuring API keys and uploading files.
- [ ] Add more tools for agents either from LangChain community or create new useful tools.
- [ ] Add more LLM options like ChatGPT and local LLMs.

## License

This application is open-source and is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Credits

Special thanks to [João Moura](https://github.com/joaomdmoura) the creator of [CrewAI](https://github.com/joaomdmoura/crewAI) for providing the underlying framework for AI crew orchestration.

## Support

If you find CrewAI Visualizer helpful and would like to support its development, consider buying me a coffee! Your support will allow me to dedicate more time to enhancing and adding new features to CrewAI Visualizer.

[https://www.buymeacoffee.com/eng_elias](https://www.buymeacoffee.com/eng_elias)

[![Buy Me a Coffee](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeW41NXV3ZXYxY2pvOG5lcjJueDF3NDFlcWNneDJ4MW9kY25jbWhzeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7kZE0z52Sd9zSESzDA/giphy.gif)](https://www.buymeacoffee.com/eng_elias)
