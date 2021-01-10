<template>
  <div class="sudokusolver">
    <SudokuSolver msg="Solve sudoku's"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SudokuSolver from '@/components/other/SudokuSolver.vue'

export default {
  name: 'Sudoku',
  components: {
    SudokuSolver
  }
}
</script>
