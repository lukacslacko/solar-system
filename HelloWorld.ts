class Startup {
    public static main(): number {
        var planet = new Planet(5);
        console.log(planet.greeting());
        return 0;
    }
}

Startup.main();
