# Python program to read an excel file

# import openpyxl module
import openpyxl

# Give the location of the file
file = 'data_kul.xlsx'

# To open the workbook
# workbook object is created
wb_obj = openpyxl.load_workbook(file)

# Get workbook active sheet object
# from the active attribute
sheet_obj = wb_obj.active

# Cell objects also have a row, column,
# and coordinate attributes that provide
# location information for the cell.

# Note: The first row or
# column integer is 1, not 0.

# Cell object is created by using
# sheet object's cell() method.
cell_obj = sheet_obj.cell(row=1, column=1)

value_file = sheet_obj.values

def get_column_number(col_letter):
    return ord(col_letter) - 65

column_response_ID_letter = 'I'
column_response_ID_number = get_column_number(column_response_ID_letter)





#using the number of the rows in excel thus the real value in a list will be this - 1
def get_response_ID(row):
    column_response_ID = list(sheet_obj.columns)[column_response_ID_number]
    index_list = row - 1
    response_ID_cell= column_response_ID[index_list]
    return response_ID_cell.value

#return the row number as in excel
def get_row(responde_ID):
    row_index = 3
    column_response_ID = list(sheet_obj.columns)[column_response_ID_number]
    for cell in column_response_ID[2:]:
        if responde_ID == cell.value:
            return row_index
        row_index += 1
    return None

