import { rename, mkdir, readdir, readFile, stat} from "fs";
import { join } from "path";

/**
 * Function that list the files of a directory and show their information
 * @param directoryPath - Path of the directory we want to analise
 */
function readDirectory(directoryPath: string): void {
  readdir(directoryPath, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (file !== undefined) {
        readFile(`${directoryPath}/${file}`, (err, data) => {
          if (err) throw err;
          console.log(`The file ${file} has ${data.byteLength} bytes`);
          stat(`${directoryPath}/${file}`, (err, stats) => {
            if (err) throw err;
            console.log(`The file ${file} was modified at ${stats.mtime}`);
          });
        });
      }
    });
  });
}

/**
 * Function that deletes a file
 * @param fileToDelete - The name of the file to delete
 */
function deleteFile(fileToDeletePath: string, deleteDestinyPath: string): void {
  mkdir(deleteDestinyPath, { recursive: true }, (err) => {
    if (err) {
      throw err;
    } else {
      console.log(`Recycle bin directory '${deleteDestinyPath}' created or already exists.`);
    }
    const fileName = fileToDeletePath.split('/').pop();
    if (fileName) {
      rename(fileToDeletePath, `${deleteDestinyPath}/${fileName}`, (err) => {
        if (err) {
          throw err;
        } else {
          console.log(`File '${fileName}' moved to '${deleteDestinyPath}'.`);
        }
      });
    } else {
      console.error("Invalid file path");
    }
  });
}

function moveFS(itemToMove: string, destinyPath: string): void {
  stat(itemToMove, (err, stats) => {
    if (err) {
      throw err;
    } else {
      if (stats.isDirectory()) {
        rename(itemToMove, `${destinyPath}/`, (err) => {
          if (err) {
            throw err; 
          } else {
            console.log(`${itemToMove} movido correctamente`)
          }
        }) 
      } else {
        const fileName = itemToMove.split('/').pop();
        rename(itemToMove, `${destinyPath}/${fileName}`, (err) => {
          if (err) {
            throw err; 
          } else {
            console.log(`${itemToMove} movido correctamente`)
          }
        })
      }
    }
  })
}

function searchFile(directoryPath: string, extension: string): void {
  readdir(directoryPath, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((file) => {
      const fullPath = join(directoryPath, file);

      stat(fullPath, (err, stats) => {
        if (err) {
          throw err;
        }

        if (stats.isDirectory()) {
          searchFile(fullPath, extension);
        } else if (file.endsWith(extension)) {
          console.log(`Archivo encontrado: ${fullPath}`);
        }
      });
    });
  });
}

readDirectory('src/')
readDirectory('dist/')
deleteFile('pruebas/eliminar.txt', 'reciclaje')
deleteFile('pruebas/hello.txt', 'reciclaje2')
moveFS('DirectorioAMover', 'DirectorioMover')
moveFS('MasPruebas/fileToMove1.txt', 'DirectorioMover')
searchFile('pruebas/', 'Eduardo.txt')