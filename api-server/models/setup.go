package models

// Setup Return Boolean if setup is done or else error
func Setup() (bool, error) {

	// This statement will prepare the Task table
	statement, _eTaskTable := DBHelper.Prepare("CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY, name TEXT, description TEXT, host TEXT, port TEXT, path TEXT, headers JSON, method TEXT, protocol TEXT, body JSON)")
	if _eTaskTable != nil {
		return false, _eTaskTable
	}

	_, _eExError := statement.Exec()
	if _eExError != nil {
		return false, _eExError
	}

	// This statement will prepare the job table
	statement, _eJobTable := DBHelper.Prepare("CREATE TABLE IF NOT EXISTS job (id INTEGER PRIMARY KEY, taskId INTEGER, cronId INTEGER, time TEXT, status TEXT)")
	if _eJobTable != nil {
		return false, _eJobTable
	}

	_, _eJobExError := statement.Exec()
	if _eJobExError != nil {
		return false, _eJobExError
	}

	return true, nil
}
