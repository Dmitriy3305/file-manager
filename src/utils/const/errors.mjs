const errors = {
  USERNAME_REQUIRED: "Please provide --username argument.",
  INVALID_INPUT: "Invalid input",
  PATH_REQUIRED_FOR_CD: 'No path specified for "cd" command',
  FILE_REQUIRED_FOR_CAT: 'No file specified for "cat" command',
  FILENAME_REQUIRED_FOR_ADD: 'No filename specified for "add" command',
  TWO_ARGUMENTS_REQUIRED_FOR_RN:
    'The "rn" command requires two arguments: the old name and the new name',
  TWO_ARGUMENTS_REQUIRED_FOR_CP:
    'The "cp" command requires two arguments: path to file and path to new directory',
  TWO_ARGUMENTS_REQUIRED_FOR_MV:
    'The "mv" command requires two arguments: path to file and path to new directory',
  PATH_REQUIRED_FOR_RM: 'The "rm" command requires one argument: path to file',
  OPTION_REQUIRED_FOR_OS: "No option provided",
  PATH_REQUIRED_FOR_HASH: "hash command requires a file path argument",
  TWO_ARGUMENTS_REQUIRED_FOR_COMPRESS:
    "compress command requires source path and destination path arguments",
  TWO_ARGUMENTS_REQUIRED_FOR_DECOMPRESS:
    "decompress command requires source path and destination path arguments",
};

export default errors;
