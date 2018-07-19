#!/usr/bin/env python
# -*- coding: utf-8 -*-
#Guía de referencia básica para python.

#Primero es la declaracion de variables.
#Las variables se declaran sin necesidad de usar una palabra reservada o comando
x = 2.3 #Float
y = 3 #Int
caracter = "a" #Char
texto = "Hola" #String
boolean = True #False

#En cualquier momento podemos reasignar el valor de una variable:
x = 5
#o declarar una nueva variable
z = 3.3

#Python es ejecutado en consola, por lo que podemos enviar variables o texto hacia la terminal.
#por ejemplo:
print "-----------------------------------------------------------------------"
print "Inicio"
print "-----------------------------------------------------------------------"
print x + y #Estamos imprimiendo el resultado de x + y.
#Podemos imprimir cualquier tipo de variable, pero debemos tener cuidado al combinar dos tipos diferentes de variable
print texto + " " + str(y) #Aca estamos conviertiendo la variable "y" en un String

#sin embargo, para ciertos operandos, podemos esperar un comportamiento distinto entre un numero y una string
print caracter * y #en este caso se concatena el contenido de la variable caracter el numero de veces que indique "y"

#Si queremos imprimir un valor en pantalla no es necesario que este se encuentre almacenado en una variable.
#Por ejemplo.
print "-----------------------------------------------------------------------"
print "Esta es una prueba. Resultado: " + str(6 * z)

#Hay otros tipos de variables que pueden almacenar valores complejos
#Entre ellos estan los Arreglos y los objetos o colecciones.

#Arreglos:
#Los arreglos pueden contener cualquier tipo de dato o combinacion de datos.
print "-----------------------------------------------------------------------"
print "Variables complejas"
print "-----------------------------------------------------------------------"
arreglo1 = [10, 2, 4, 5, 7]
arreglo2 = [3, False, 5, x, "a"] #Incluyendo variables.
#Y estos valores se pueden acceder de la siguiente manera:
print "Valor 4 del arreglo1 : " + str(arreglo1[3]) #Usamos 3 por que el conteo de posiciones en un arreglo empieza en 0.
#Podemos hacer operaciones entre arreglos y variables
print "Resultado de la suma : " + str(arreglo1[0] + y + 37)

#Objetos o colecciones
coleccion = {
    "equis" : 3,
    "ye" : 2,
    "3" : 1
}
#Y se acceden los datos de la siguiente manera:
print "-----------------------------------------------------------------------"
print coleccion["equis"]
print coleccion["ye"] + coleccion["equis"]

#El manejo de Strings o cadenas de caracteres es importante en cualquier lenguaje de programacion.
#Supongamos que tenemos una URL
url = "www.facebook.com/jguillen/?profile=jguillen00&age=24" #Como programadores, queremos obtener los valores que estan despues
# del ? signo de interrogacion. es decir, profile y age, ciertos frameworks ofrecen funciones para obtenerlos, pero de manera
#artesanal necesitamos usar los METODOS o FUNCIONES que heredan los tipo de variable STRING.
# https://developers.google.com/edu/python/strings#string-methods aca podemos encontrar la documentacion sobre los distintos metodos.
#Ejemplo:
print "-----------------------------------------------------------------------"
print "Strings"
print "-----------------------------------------------------------------------"
division = url.split("?")
print division #Nuestra string ahora se ha convertido en un arreglo de Strings que contiene todo lo que hay en url hasta "?" y el derecho.

#ahora partimos la segunda parte entre &
division2 = division[1].split("&")
print division2

#ahora lo dividimos por =
profile = division2[0].split("=")[1]
age = division2[1].split("=")[1]
#Esto nos lo pudimos haber ahorrado en una sola linea profile = url.split("?")[1].split("&")[0].split("=")[1]
print "profile es = "+ profile + " y age = " + age

print "-----------------------------------------------------------------------"
print "Condicionales"
print "-----------------------------------------------------------------------"
#Condicionales:
if x > y:
    print "Equis es mayor que Y"
else:
    print "Y es mayor que X"
print "-----------------------------------------------------------------------"
if boolean:
    print "La variable boolean contiene True"
print "-----------------------------------------------------------------------"
if len(url) > 5:
    print "La variable url contiene mas de 5 caracteres."

print "-----------------------------------------------------------------------"
print "Ciclos de repeticion"
print "-----------------------------------------------------------------------"
#Ciclos de repeticion:
while x < 7:
    print "Equis aun no es 7, es: " + str(x)
    x=x+1
print "Equis ahora es : " + str(x)
print "-----------------------------------------------------------------------"

for x in range(1, 10):
    print x

print "-----------------------------------------------------------------------"
#podemos recorrer un arreglo.
for x in arreglo1:
    print str(x)

print "-----------------------------------------------------------------------"
print "Funciones"
print "-----------------------------------------------------------------------"
#Finalmente podemos definir funciones.
#Por ejemplo una funcion que suma.
def suma(x, y): #Aqui le decimos que va a recibir dos parametros 'x' y 'y'
    resultado = x + y 
    print "Resultado de " + str(x) + " mas " + str(y) +  " = " + str(resultado) 
    return resultado # O simplemente return x + y

suma(5, 7) #asi invocamos la funcion.
#podemos almacenar el resultado en una variable
result = suma(6, 8)
print result * 10

#Podemos hacer una funcion de cualquier cosa:
def squares(c, size):
    for x in range(0, size):
        if x == 0 or x == size-1: #Eso significa "Si x es igual a 0 o x es igual al valor de size"
            print c * size
        else:
            print c + (" " * (size - 2)) + c

#Esta funcion va a imprimir un cuadro de dimensiones 5 hecho con *
squares("*", 5)

#Este un cuadro con o, de tamanio 7.
squares("o", 7)

#En adicion, en python puedes agregar librerias, cosa que explicare mas a detalle despues, por el momento
#concentrarse en la logica basica de la programacion es la clave.